import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Settings.css';

const Settings = () => {
  const [formTitle, setFormTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'form_title')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setFormTitle(data?.value || 'Tilawah Registration Form');
    } catch (err) {
      console.error('Error fetching settings:', err);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formTitle.trim()) {
      setMessage({ type: 'error', text: 'Form title cannot be empty' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const { error } = await supabase
        .from('settings')
        .upsert({ 
          key: 'form_title', 
          value: formTitle.trim() 
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err) {
      console.error('Error saving settings:', err);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <div className="settings-container">
      <h2>Application Settings</h2>
      
      <form onSubmit={handleSave} className="settings-form">
        <div className="form-group">
          <label htmlFor="formTitle">Registration Form Title</label>
          <input
            type="text"
            id="formTitle"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            disabled={saving}
            placeholder="Enter form title"
            maxLength={100}
          />
          <small>This title will be displayed at the top of the registration form</small>
        </div>

        <button type="submit" disabled={saving} className="save-btn">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Settings;
