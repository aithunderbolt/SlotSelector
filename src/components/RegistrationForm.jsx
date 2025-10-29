import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useSlotAvailability } from '../hooks/useSlotAvailability';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp_mobile: '',
    slot_id: '',
    fathers_name: '',
    date_of_birth: '',
    tajweed_level: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { availableSlots, loading, error, refetch } = useSlotAvailability();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Name is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Valid email is required';
    }
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.whatsapp_mobile)) {
      return 'Valid WhatsApp mobile number is required';
    }
    if (!formData.date_of_birth) {
      return 'Date of Birth is required';
    }
    if (!formData.tajweed_level) {
      return 'Please select your Tajweed level';
    }
    if (!formData.slot_id) {
      return 'Please select a time slot';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setSubmitStatus({ type: 'error', message: validationError });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      // Check if WhatsApp number already exists
      const { data: existingRegistration, error: checkError } = await supabase
        .from('registrations')
        .select('whatsapp_mobile')
        .eq('whatsapp_mobile', formData.whatsapp_mobile)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingRegistration) {
        setSubmitStatus({
          type: 'error',
          message: 'This WhatsApp number is already registered.',
        });
        setSubmitting(false);
        return;
      }

      const { error } = await supabase
        .from('registrations')
        .insert([formData]);

      if (error) throw error;

      const selectedSlot = availableSlots.find(slot => slot.id === formData.slot_id);
      setSubmitStatus({
        type: 'success',
        message: `Registration successful! You have been registered for ${selectedSlot?.display_name || 'the selected slot'}`,
      });
      setFormData({
        name: '',
        email: '',
        whatsapp_mobile: '',
        slot_id: '',
        fathers_name: '',
        date_of_birth: '',
        tajweed_level: '',
      });
      refetch();
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: err.message.includes('slot is full')
          ? 'This slot is now full. Please select another slot.'
          : err.message.includes('duplicate') || err.message.includes('unique')
          ? 'This WhatsApp number is already registered.'
          : 'Registration failed. Please try again.',
      });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading available slots...</div>;
  }

  if (error) {
    return <div className="error">Error loading slots: {error}</div>;
  }

  if (availableSlots.length === 0) {
    return (
      <div className="container">
        <div className="form-card">
          <h1>Registration Form</h1>
          <div className="error">All slots are currently full. Please check back later.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-card">
        <h1>Tilawah Registration Form</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fathers_name">Father's Name</label>
            <input
              type="text"
              id="fathers_name"
              name="fathers_name"
              value={formData.fathers_name}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date_of_birth">Date of Birth *</label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatsapp_mobile">WhatsApp Mobile *</label>
            <input
              type="tel"
              id="whatsapp_mobile"
              name="whatsapp_mobile"
              value={formData.whatsapp_mobile}
              onChange={handleChange}
              placeholder="+1234567890"
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tajweed_level">Level of Tajweed *</label>
            <select
              id="tajweed_level"
              name="tajweed_level"
              value={formData.tajweed_level}
              onChange={handleChange}
              required
              disabled={submitting}
            >
              <option value="">Select your level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="slot_id">Time Slot *</label>
            <select
              id="slot_id"
              name="slot_id"
              value={formData.slot_id}
              onChange={handleChange}
              required
              disabled={submitting}
            >
              <option value="">Select a time slot</option>
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.display_name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? 'Submitting...' : 'Register'}
          </button>
        </form>

        {submitStatus && (
          <div className={`status-message ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
