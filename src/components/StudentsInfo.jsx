import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './StudentsInfo.css';

const StudentsInfo = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [studentInfo, setStudentInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [expandedStudents, setExpandedStudents] = useState({});

  const performanceFields = [
    { key: 'attendance', label: 'Attendance' },
    { key: 'homework', label: 'Homework' },
    { key: 'partner_recitation', label: 'Partner Recitation' },
    { key: 'jali', label: 'Jali' },
    { key: 'khafi', label: 'Khafi' },
    { key: 'akhfa', label: 'Akhfa' },
    { key: 'tone', label: 'Tone' },
    { key: 'fluency', label: 'Fluency' },
    { key: 'discipline', label: 'Discipline' }
  ];

  useEffect(() => {
    fetchData();
  }, [user.assigned_slot_id]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentInfo();
    }
  }, [selectedClass]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch students for this slot
      const { data: studentsData, error: studentsError } = await supabase
        .from('registrations')
        .select('id, name, fathers_name, email')
        .eq('slot_id', user.assigned_slot_id)
        .order('name', { ascending: true });

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Fetch classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .order('name', { ascending: true });

      if (classesError) throw classesError;
      setClasses(classesData || []);

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentInfo = async () => {
    if (!selectedClass) return;

    try {
      const { data, error } = await supabase
        .from('student_info')
        .select('*')
        .eq('class_id', selectedClass)
        .eq('slot_id', user.assigned_slot_id);

      if (error) throw error;

      // Convert array to object keyed by registration_id
      const infoMap = {};
      (data || []).forEach(info => {
        infoMap[info.registration_id] = info;
      });
      setStudentInfo(infoMap);
    } catch (err) {
      console.error('Error fetching student info:', err);
    }
  };

  const handleCheckboxChange = (studentId, field) => {
    setStudentInfo(prev => {
      const current = prev[studentId] || {};
      return {
        ...prev,
        [studentId]: {
          ...current,
          [field]: current[field] === 1 ? 0 : 1
        }
      };
    });
  };

  const calculateTotal = (studentId) => {
    const info = studentInfo[studentId] || {};
    return performanceFields.reduce((sum, field) => sum + (info[field.key] || 0), 0);
  };

  const handleSave = async (studentId) => {
    if (!selectedClass) {
      setError('Please select a class first');
      return;
    }

    try {
      setSaving(true);
      const info = studentInfo[studentId] || {};
      
      const dataToSave = {
        registration_id: studentId,
        class_id: selectedClass,
        slot_id: user.assigned_slot_id,
        admin_user_id: user.id,
        attendance: info.attendance || 0,
        homework: info.homework || 0,
        partner_recitation: info.partner_recitation || 0,
        jali: info.jali || 0,
        khafi: info.khafi || 0,
        akhfa: info.akhfa || 0,
        tone: info.tone || 0,
        fluency: info.fluency || 0,
        discipline: info.discipline || 0,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('student_info')
        .upsert(dataToSave, {
          onConflict: 'registration_id,class_id'
        });

      if (error) throw error;

      setError(null);
      // Show success briefly
      const studentName = students.find(s => s.id === studentId)?.name;
      setError(`✓ Saved information for ${studentName}`);
      setTimeout(() => setError(null), 2000);
    } catch (err) {
      setError(err.message);
      console.error('Error saving student info:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleExpand = (studentId) => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  if (loading) {
    return <div className="loading">Loading students...</div>;
  }

  return (
    <div className="students-info">
      <div className="students-info-header">
        <h2>Students Information</h2>
        <div className="class-selector">
          <label htmlFor="class-select">Select Class:</label>
          <select
            id="class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="class-select"
          >
            <option value="">-- Select a Class --</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className={`message ${error.startsWith('✓') ? 'success' : 'error'}`}>
          {error}
        </div>
      )}

      {!selectedClass ? (
        <div className="no-data">Please select a class to view and enter student information.</div>
      ) : students.length === 0 ? (
        <div className="no-data">No students found in your slot.</div>
      ) : (
        <div className="students-list">
          {students.map(student => {
            const isExpanded = expandedStudents[student.id];
            const total = calculateTotal(student.id);
            const maxMarks = performanceFields.length;

            return (
              <div key={student.id} className="student-card">
                <div className="student-header" onClick={() => toggleExpand(student.id)}>
                  <div className="student-name-section">
                    <h3>{student.name}</h3>
                    {student.fathers_name && (
                      <p className="fathers-name">Father: {student.fathers_name}</p>
                    )}
                  </div>
                  <div className="student-total">
                    <span className="total-marks">{total}/{maxMarks}</span>
                    <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="student-details">
                    <div className="performance-grid">
                      {performanceFields.map(field => (
                        <div key={field.key} className="performance-item">
                          <label>
                            <input
                              type="checkbox"
                              checked={(studentInfo[student.id]?.[field.key] || 0) === 1}
                              onChange={() => handleCheckboxChange(student.id, field.key)}
                              disabled={saving}
                            />
                            <span>{field.label}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="student-actions">
                      <button
                        onClick={() => handleSave(student.id)}
                        disabled={saving}
                        className="save-btn"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentsInfo;
