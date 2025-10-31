import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useSlotAvailability = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxRegistrations, setMaxRegistrations] = useState(15);

  const fetchSlotCounts = async () => {
    try {
      setLoading(true);
      
      // Fetch max registrations setting
      const { data: settingData, error: settingError } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'max_registrations_per_slot')
        .single();

      if (settingError && settingError.code !== 'PGRST116') throw settingError;
      
      const maxReg = settingData?.value ? parseInt(settingData.value) : 15;
      setMaxRegistrations(maxReg);
      
      // Fetch all slots
      const { data: slotsData, error: slotsError } = await supabase
        .from('slots')
        .select('*')
        .order('slot_order', { ascending: true });

      if (slotsError) throw slotsError;
      setAllSlots(slotsData);

      // Fetch registrations
      const { data: registrationsData, error: registrationsError } = await supabase
        .from('registrations')
        .select('slot_id');

      if (registrationsError) throw registrationsError;

      // Count registrations per slot
      const slotCounts = {};
      slotsData.forEach((slot) => {
        slotCounts[slot.id] = 0;
      });

      registrationsData.forEach((registration) => {
        if (slotCounts[registration.slot_id] !== undefined) {
          slotCounts[registration.slot_id]++;
        }
      });

      // Filter available slots
      const available = slotsData.filter(
        (slot) => slotCounts[slot.id] < maxReg
      );

      setAvailableSlots(available);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching slot availability:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotCounts();

    const registrationsChannel = supabase
      .channel('registrations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
        () => {
          fetchSlotCounts();
        }
      )
      .subscribe();

    const slotsChannel = supabase
      .channel('slots-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'slots' },
        () => {
          fetchSlotCounts();
        }
      )
      .subscribe();

    const settingsChannel = supabase
      .channel('settings-max-reg-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'settings', filter: 'key=eq.max_registrations_per_slot' },
        () => {
          fetchSlotCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(registrationsChannel);
      supabase.removeChannel(slotsChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  return { availableSlots, allSlots, loading, error, maxRegistrations, refetch: fetchSlotCounts };
};
