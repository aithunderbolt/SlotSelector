import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './Settings.css';

const Settings = () => {
  const [formTitle, setFormTitle] = useState('');
  const [maxRegistrations, setMaxRegistrations] = useState('15');
  const [allowStudentInfo, setAllowStudentInfo] = useState(false);
  const [maxAttachmentSizeKB, setMaxAttachmentSizeKB] = useState('400');
  const [supervisorName, setSupervisorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Student Info Marks Configuration
  const [studentInfoMarks, setStudentInfoMarks] = useState({
    homework: '1',
    partner_recitation: '1',
    jali: '1',
    khafi: '1',
    akhfa: '1',
    tone: '1',
    fluency: '1',
    discipline: '1',
    attendance_present: '1',
    attendance_absent: '0',
    attendance_on_leave: '0.5'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error && error.code !== 'PGRST116') throw error;

      const settings = data || [];
      const titleSetting = settings.find(s => s.key === 'form_title');
      const maxRegSetting = settings.find(s => s.key === 'max_registrations_per_slot');
      const studentInfoSetting = settings.find(s => s.key === 'allow_student_info_entry');
      const maxAttachmentSetting = settings.find(s => s.key === 'max_attachment_size_kb');
      const supervisorSetting = settings.find(s => s.key === 'supervisor_name');

      setFormTitle(titleSetting?.value || 'Tilawah Registration Form');
      setMaxRegistrations(maxRegSetting?.value || '15');
      setAllowStudentInfo(studentInfoSetting?.value === 'true');
      setMaxAttachmentSizeKB(maxAttachmentSetting?.value || '400');
      setSupervisorName(supervisorSetting?.value || '');

      // Load student info marks settings
      const marksSettings = {
        homework: settings.find(s => s.key === 'student_info_marks_homework')?.value || '1',
        partner_recitation: settings.find(s => s.key === 'student_info_marks_partner_recitation')?.value || '1',
        jali: settings.find(s => s.key === 'student_info_marks_jali')?.value || '1',
        khafi: settings.find(s => s.key === 'student_info_marks_khafi')?.value || '1',
        akhfa: settings.find(s => s.key === 'student_info_marks_akhfa')?.value || '1',
        tone: settings.find(s => s.key === 'student_info_marks_tone')?.value || '1',
        fluency: settings.find(s => s.key === 'student_info_marks_fluency')?.value || '1',
        discipline: settings.find(s => s.key === 'student_info_marks_discipline')?.value || '1',
        attendance_present: settings.find(s => s.key === 'student_info_marks_attendance_present')?.value || '1',
        attendance_absent: settings.find(s => s.key === 'student_info_marks_attendance_absent')?.value || '0',
        attendance_on_leave: settings.find(s => s.key === 'student_info_marks_attendance_on_leave')?.value || '0.5'
      };
      setStudentInfoMarks(marksSettings);
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

    const maxAttachmentSize = parseInt(maxAttachmentSizeKB);
    if (isNaN(maxAttachmentSize) || maxAttachmentSize < 1) {
      setMessage({ type: 'error', text: 'Maximum attachment size must be a positive number' });
      return;
    }

    if (maxAttachmentSize > 10240) {
      setMessage({ type: 'error', text: 'Maximum attachment size cannot exceed 10240 KB (10 MB)' });
      return;
    }

    // Validate student info marks
    for (const [key, value] of Object.entries(studentInfoMarks)) {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        setMessage({ type: 'error', text: `Invalid mark value for ${key.replace(/_/g, ' ')}` });
        return;
      }
      if (numValue > 100) {
        setMessage({ type: 'error', text: `Mark value for ${key.replace(/_/g, ' ')} cannot exceed 100` });
        return;
      }
    }

    try {
      setSaving(true);
      setMessage(null);

      const settingsToSave = [
        { key: 'form_title', value: formTitle.trim() },
        { key: 'max_registrations_per_slot', value: maxRegNum.toString() },
        { key: 'allow_student_info_entry', value: allowStudentInfo.toString() },
        { key: 'max_attachment_size_kb', value: maxAttachmentSize.toString() },
        { key: 'supervisor_name', value: supervisorName.trim() },
        { key: 'student_info_marks_homework', value: studentInfoMarks.homework },
        { key: 'student_info_marks_partner_recitation', value: studentInfoMarks.partner_recitation },
        { key: 'student_info_marks_jali', value: studentInfoMarks.jali },
        { key: 'student_info_marks_khafi', value: studentInfoMarks.khafi },
        { key: 'student_info_marks_akhfa', value: studentInfoMarks.akhfa },
        { key: 'student_info_marks_tone', value: studentInfoMarks.tone },
        { key: 'student_info_marks_fluency', value: studentInfoMarks.fluency },
        { key: 'student_info_marks_discipline', value: studentInfoMarks.discipline },
        { key: 'student_info_marks_attendance_present', value: studentInfoMarks.attendance_present },
        { key: 'student_info_marks_attendance_absent', value: studentInfoMarks.attendance_absent },
        { key: 'student_info_marks_attendance_on_leave', value: studentInfoMarks.attendance_on_leave }
      ];

      const { error } = await supabase
        .from('settings')
        .upsert(settingsToSave, {
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
          <label htmlFor="maxAttachmentSize">Maximum Attachment Size (KB)</label>
          <input
            type="number"
            id="maxAttachmentSize"
            value={maxAttachmentSizeKB}
            onChange={(e) => setMaxAttachmentSizeKB(e.target.value)}
            disabled={saving}
            placeholder="Enter maximum attachment size in KB"
            min="1"
            max="10240"
          />
          <small>Maximum file size for attendance attachments in KB (e.g., 500 for 500 KB, max 10240 KB)</small>
        </div>

        <div className="form-group">
          <label htmlFor="supervisorName">Supervisor Name</label>
          <input
            type="text"
            id="supervisorName"
            value={supervisorName}
            onChange={(e) => setSupervisorName(e.target.value)}
            disabled={saving}
            placeholder="Enter supervisor name"
            maxLength={100}
          />
          <small>This name will be displayed as the supervisor in the class reports</small>
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

        {allowStudentInfo && (
          <div className="student-info-marks-section">
            <h3>Student Information Marks Configuration</h3>
            <p className="section-description">Configure the marks for each performance indicator</p>

            <div className="marks-grid">
              <div className="marks-group">
                <h4>Performance Indicators</h4>

                <div className="form-group-inline">
                  <label htmlFor="marks_homework">Homework</label>
                  <input
                    type="number"
                    id="marks_homework"
                    value={studentInfoMarks.homework}
                    onChange={(e) => setStudentInfoMarks(prev => ({ ...prev, homework: e.target.value }))}
                    disabled={saving}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>

                <div className="form-group-inline">
                  <label htmlFor="marks_partner_recitation">Partner Recitation</label>
                  <input
                    type="number"
                    id="marks_partner_recitation"
                    value={studentInfoMarks.partner_recitation}
                    onChange={(e) => setStudentInfoMarks(prev => ({ ...prev, partner_recitation: e.target.value }))}
                    disabled={saving}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>

                <div className="form-group-inline">
                  <label htmlFor="marks_jali">Jali</label>
                  <input
                    type="number"
                    id="marks_jali"
                    value={studentInfoMarks.jali}
                    onChange={(e) => setStudentInfoMarks(prev => ({ ...prev, jali: e.target.value }))}
                    disabled={saving}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>

                <div className="form-group-inline">
                  <label htmlFor="marks_khafi">Khafi</label>
                  <input
                    type="number"
                    id="marks_khafi"
                    value={studentInfoMarks.khafi}
                    onChange={(e) => setStudentInfoMarks(prev => ({ ...prev, khafi: e.target.value }))}
                    disabled={saving}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>

                <div className="form-group-inline">
                  <label htmlFor="marks_akhfa">Akhfa</label>
                  <input
                    type="number"
                    id="marks_akhfa"
                    value={studentInfoMarks.akhfa}
                    onChange={(e) => setStudentInfoMarks(prev => ({ ...prev, akhfa: e.target.value }))}
                    disabled={saving}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>

                <div className="form-group-inline">
                  <label htmlFor="marks_tone">Tone</label>
                  <input
                    type="number"
                    id="marks_tone"
                    value={studentInfoMarks.tone}
                    onChange={(e) => setStudentInfoMarks(prev => ({ ...prev, tone: e.target.value }))}
                    disabled={saving}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>

                <div className="form-group-inline">
                  <label htmlFor="marks_fluency">Fluency</label>
                  <input
                    type="number"
                    id="marks_fluency"
                    value={studentInfoMarks.fluency}
                    onChange={(e) => setStudentInfoMarks(prev => ({ ...prev, fluency: e.target.value }))}
                    disabled={saving}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>

                <div className="form-group-inline">
                  <label htmlFor="marks_discipline">Discipline</label>
                  <input
                    type="number"
                    id="marks_discipline"
                    value={studentInfoMarks.discipline}
                    onChange={(e) => setStudentInfoMarks(prev => ({ ...prev, discipline: e.target.value }))}
                    disabled={saving}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>
              </div>

              <div className="marks-group">
                <h4>Attendance Marks</h4>

                <div className="form-group-inline">
                  <label htmlFor="marks_attendance_present">Present</label>
                  <input
                    type="number"
                    id="marks_attendance_present"
                    value={studentInfoMarks.attendance_present}
                    onChange={(e) => setStudentInfoMarks(prev => ({ ...prev, attendance_present: e.target.value }))}
                    disabled={saving}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>

                <div className="form-group-inline">
                  <label htmlFor="marks_attendance_absent">Absent</label>
                  <input
                    type="number"
                    id="marks_attendance_absent"
                    value={studentInfoMarks.attendance_absent}
                    onChange={(e) => setStudentInfoMarks(prev => ({ ...prev, attendance_absent: e.target.value }))}
                    disabled={saving}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>

                <div className="form-group-inline">
                  <label htmlFor="marks_attendance_on_leave">On Leave</label>
                  <input
                    type="number"
                    id="marks_attendance_on_leave"
                    value={studentInfoMarks.attendance_on_leave}
                    onChange={(e) => setStudentInfoMarks(prev => ({ ...prev, attendance_on_leave: e.target.value }))}
                    disabled={saving}
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

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
