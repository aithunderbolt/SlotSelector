import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const MAX_REGISTRATIONS_PER_SLOT = 2;
const TOTAL_SLOTS = 10;

export const useSlotAvailability = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSlotCounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('registrations')
        .select('time_slot');

      if (error) throw error;

      const slotCounts = {};
      for (let i = 1; i <= TOTAL_SLOTS; i++) {
        slotCounts[`Slot ${i}`] = 0;
      }

      data.forEach((registration) => {
        if (slotCounts[registration.time_slot] !== undefined) {
          slotCounts[registration.time_slot]++;
        }
      });

      const available = Object.entries(slotCounts)
        .filter(([_, count]) => count < MAX_REGISTRATIONS_PER_SLOT)
        .map(([slot]) => slot);

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

    const channel = supabase
      .channel('registrations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
        () => {
          fetchSlotCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { availableSlots, loading, error, refetch: fetchSlotCounts };
};
