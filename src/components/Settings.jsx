import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Settings.css';

const Settings = () => {
  const [formTitle, setFormTitle] = useState('');
  const [maxRegistrations, setMaxRegistrations] = useState('15');
  const [allowStudentInfo, setAllowStudentInfo] = useState(false);
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
        .in('key', ['form_title', 'max_registrations_per_slot', 'allow_student_info_entry']);

      if (error && error.code !== 'PGRST116') throw error;
      
      const settings = data || [];
      const titleSetting = settings.find(s => s.key === 'form_title');
      const maxRegSetting = settings.find(s => s.key === 'max_registrations_per_slot');
      const studentInfoSetting = settings.find(s => s.key === 'allow_student_info_entry');
      
      setFormTitle(titleSetting?.value || 'Tilawah Registration Form');
      setMaxRegistrations(maxRegSetting?.value || '15');
      setAllowStudentInfo(studentInfoSetting?.value === 'true');
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

    const maxRegNum = parseInt(maxRegistrations);
    if (isNaN(maxRegNum) || maxRegNum < 1) {
      setMessage({ type: 'error', text: 'Maximum registrations must be a positive number' });
      return;
    }

    if (maxRegNum > 100) {
      setMessage({ type: 'error', text: 'Maximum registrations cannot exceed 100' });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const { error: titleError } = await supabase
        .from('settings')
        .upsert({ 
          key: 'form_title', 
          value: formTitle.trim() 
        }, {
          onConflict: 'key'
        });

      if (titleError) throw titleError;

      const { error: maxRegError } = await supabase
        .from('settings')
        .upsert({ 
          key: 'max_registrations_per_slot', 
          value: maxRegNum.toString() 
        }, {
          onConflict: 'key'
        });

      if (maxRegError) throw maxRegError;

      const { error: studentInfoError } = await supabase
        .from('settings')
        .upsert({ 
          key: 'allow_student_info_entry', 
          value: allowStudentInfo.toString() 
        }, {
          onConflict: 'key'
        });

      if (studentInfoError) throw studentInfoError;

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

        <div className="form-group">
          <label htmlFor="maxRegistrations">Maximum Registrations Per Slot</label>
          <input
            type="number"
            id="maxRegistrations"
            value={maxRegistrations}
            onChange={(e) => setMaxRegistrations(e.target.value)}
            disabled={saving}
            placeholder="Enter maximum registrations"
            min="1"
            max="100"
          />
          <small>Maximum number of students that can register for each time slot (1-100)</small>
        </div>

        <div className="form-group">
          <label className="switch-label">
            <span>Allow Entering of Student Information</span>
            <div className="switch-container">
              <input
                type="checkbox"
                id="allowStudentInfo"
                checked={allowStudentInfo}
                onChange={(e) => setAllowStudentInfo(e.target.checked)}
                disabled={saving}
                className="switch-input"
              />
              <label htmlFor="allowStudentInfo" className="switch"></label>
            </div>
          </label>
          <small>When enabled, slot admins can access the "Students Info" tab to enter performance data for each student</small>
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
