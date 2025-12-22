import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './StudentsPerformance.css';

const StudentsPerformance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [viewMode, setViewMode] = useState('summary'); // summary, detailed, students
  const [marksConfig, setMarksConfig] = useState({
    homework: 1,
    partner_recitation: 1,
    jali: 1,
    khafi: 1,
    akhfa: 1,
    tone: 1,
    fluency: 1,
    discipline: 1,
    attendance_present: 1,
    attendance_absent: 0,
    attendance_on_leave: 0.5
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (classes.length > 0) {
      fetchAnalytics();
    }
  }, [selectedClass, classes]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch marks configuration
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('*')
        .like('key', 'student_info_marks_%');

      if (settingsError) throw settingsError;

      const marks = {};
      (settingsData || []).forEach(setting => {
        const key = setting.key.replace('student_info_marks_', '');
        marks[key] = parseFloat(setting.value);
      });
      setMarksConfig(prev => ({ ...prev, ...marks }));

      // Fetch classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .order('name', { ascending: true });

      if (classesError) throw classesError;
      setClasses(classesData || []);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('student_info')
        .select(`
          *,
          registrations (
            id,
            name,
            fathers_name,
            email,
            slots (
              id,
              display_name
            )
          ),
          classes (
            id,
            name
          )
        `);

      if (selectedClass !== 'all') {
        query = query.eq('class_id', selectedClass);
      }

      const { data, error } = await query;
      if (error) throw error;

      const processedData = processAnalytics(data || []);
      setAnalytics(processedData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStudentTotal = (info) => {
    let total = 0;
    
    // Performance fields
    const fields = ['homework', 'partner_recitation', 'jali', 'khafi', 'akhfa', 'tone', 'fluency', 'discipline'];
    fields.forEach(field => {
      if (info[field] === 1) {
        total += marksConfig[field] || 0;
      }
    });
    
    // Attendance
    if (info.attendance === 'present') {
      total += marksConfig.attendance_present || 0;
    } else if (info.attendance === 'absent') {
      total += marksConfig.attendance_absent || 0;
    } else if (info.attendance === 'on_leave') {
      total += marksConfig.attendance_on_leave || 0;
    }
    
    return total;
  };

  const getMaxMarks = () => {
    let max = 0;
    const fields = ['homework', 'partner_recitation', 'jali', 'khafi', 'akhfa', 'tone', 'fluency', 'discipline'];
    fields.forEach(field => {
      max += marksConfig[field] || 0;
    });
    max += marksConfig.attendance_present || 0;
    return max;
  };

  const processAnalytics = (data) => {
    const maxMarks = getMaxMarks();
    
    // Overall statistics
    const totalRecords = data.length;
    const uniqueStudents = new Set(data.map(d => d.registration_id)).size;
    const uniqueClasses = new Set(data.map(d => d.class_id)).size;
    
    // Calculate totals and averages
    let totalMarks = 0;
    let attendanceStats = { present: 0, absent: 0, on_leave: 0 };
    let performanceStats = {
      homework: 0,
      partner_recitation: 0,
      jali: 0,
      khafi: 0,
      akhfa: 0,
      tone: 0,
      fluency: 0,
      discipline: 0
    };

    data.forEach(record => {
      totalMarks += calculateStudentTotal(record);
      attendanceStats[record.attendance]++;
      
      Object.keys(performanceStats).forEach(field => {
        if (record[field] === 1) {
          performanceStats[field]++;
        }
      });
    });

    const averageMarks = totalRecords > 0 ? (totalMarks / totalRecords).toFixed(2) : 0;
    const averagePercentage = totalRecords > 0 ? ((totalMarks / (totalRecords * maxMarks)) * 100).toFixed(1) : 0;

    // Per-class breakdown
    const classSummary = {};
    data.forEach(record => {
      const classId = record.class_id;
      const className = record.classes?.name || 'Unknown';
      
      if (!classSummary[classId]) {
        classSummary[classId] = {
          className,
          totalRecords: 0,
          totalMarks: 0,
          students: new Set(),
          attendance: { present: 0, absent: 0, on_leave: 0 },
          performance: {
            homework: 0,
            partner_recitation: 0,
            jali: 0,
            khafi: 0,
            akhfa: 0,
            tone: 0,
            fluency: 0,
            discipline: 0
          }
        };
      }

      classSummary[classId].totalRecords++;
      classSummary[classId].totalMarks += calculateStudentTotal(record);
      classSummary[classId].students.add(record.registration_id);
      classSummary[classId].attendance[record.attendance]++;
      
      Object.keys(classSummary[classId].performance).forEach(field => {
        if (record[field] === 1) {
          classSummary[classId].performance[field]++;
        }
      });
    });

    // Convert to array and calculate averages
    const classBreakdown = Object.entries(classSummary).map(([classId, stats]) => ({
      classId,
      className: stats.className,
      totalRecords: stats.totalRecords,
      uniqueStudents: stats.students.size,
      averageMarks: (stats.totalMarks / stats.totalRecords).toFixed(2),
      averagePercentage: ((stats.totalMarks / (stats.totalRecords * maxMarks)) * 100).toFixed(1),
      attendance: stats.attendance,
      performance: stats.performance
    }));

    // Student-level aggregation
    const studentSummary = {};
    data.forEach(record => {
      const studentId = record.registration_id;
      const studentName = record.registrations?.name || 'Unknown';
      const slotName = record.registrations?.slots?.display_name || 'Unknown';
      
      if (!studentSummary[studentId]) {
        studentSummary[studentId] = {
          studentId,
          studentName,
          slotName,
          classesAttended: 0,
          totalMarks: 0,
          attendance: { present: 0, absent: 0, on_leave: 0 },
          performance: {
            homework: 0,
            partner_recitation: 0,
            jali: 0,
            khafi: 0,
            akhfa: 0,
            tone: 0,
            fluency: 0,
            discipline: 0
          }
        };
      }

      studentSummary[studentId].classesAttended++;
      studentSummary[studentId].totalMarks += calculateStudentTotal(record);
      studentSummary[studentId].attendance[record.attendance]++;
      
      Object.keys(studentSummary[studentId].performance).forEach(field => {
        if (record[field] === 1) {
          studentSummary[studentId].performance[field]++;
        }
      });
    });

    const studentBreakdown = Object.values(studentSummary).map(student => ({
      ...student,
      averageMarks: (student.totalMarks / student.classesAttended).toFixed(2),
      averagePercentage: ((student.totalMarks / (student.classesAttended * maxMarks)) * 100).toFixed(1),
      attendanceRate: ((student.attendance.present / student.classesAttended) * 100).toFixed(1)
    })).sort((a, b) => b.totalMarks - a.totalMarks);

    return {
      overall: {
        totalRecords,
        uniqueStudents,
        uniqueClasses,
        averageMarks,
        averagePercentage,
        maxMarks,
        attendanceStats,
        performanceStats
      },
      classBreakdown,
      studentBreakdown
    };
  };

  const renderSummaryView = () => {
    if (!analytics) return null;

    const { overall, classBreakdown } = analytics;

    return (
      <div className="summary-view">
        <div className="overview-cards">
          <div className="metric-card">
            <h3>Total Records</h3>
            <div className="metric-value">{overall.totalRecords}</div>
            <div className="metric-label">Class Sessions</div>
          </div>
          <div className="metric-card">
            <h3>Unique Students</h3>
            <div className="metric-value">{overall.uniqueStudents}</div>
            <div className="metric-label">Tracked</div>
          </div>
          <div className="metric-card">
            <h3>Average Performance</h3>
            <div className="metric-value">{overall.averageMarks}/{overall.maxMarks}</div>
            <div className="metric-label">{overall.averagePercentage}%</div>
          </div>
          <div className="metric-card">
            <h3>Classes Covered</h3>
            <div className="metric-value">{overall.uniqueClasses}</div>
            <div className="metric-label">Different Classes</div>
          </div>
        </div>

        <div className="attendance-overview">
          <h3>Attendance Overview</h3>
          <div className="attendance-bars">
            <div className="attendance-bar">
              <div className="bar-label">Present</div>
              <div className="bar-container">
                <div 
                  className="bar-fill present" 
                  style={{ width: `${(overall.attendanceStats.present / overall.totalRecords) * 100}%` }}
                ></div>
              </div>
              <div className="bar-value">{overall.attendanceStats.present} ({((overall.attendanceStats.present / overall.totalRecords) * 100).toFixed(1)}%)</div>
            </div>
            <div className="attendance-bar">
              <div className="bar-label">Absent</div>
              <div className="bar-container">
                <div 
                  className="bar-fill absent" 
                  style={{ width: `${(overall.attendanceStats.absent / overall.totalRecords) * 100}%` }}
                ></div>
              </div>
              <div className="bar-value">{overall.attendanceStats.absent} ({((overall.attendanceStats.absent / overall.totalRecords) * 100).toFixed(1)}%)</div>
            </div>
            <div className="attendance-bar">
              <div className="bar-label">On Leave</div>
              <div className="bar-container">
                <div 
                  className="bar-fill on-leave" 
                  style={{ width: `${(overall.attendanceStats.on_leave / overall.totalRecords) * 100}%` }}
                ></div>
              </div>
              <div className="bar-value">{overall.attendanceStats.on_leave} ({((overall.attendanceStats.on_leave / overall.totalRecords) * 100).toFixed(1)}%)</div>
            </div>
          </div>
        </div>

        <div className="performance-overview">
          <h3>Performance Indicators</h3>
          <div className="performance-grid">
            {Object.entries(overall.performanceStats).map(([field, count]) => (
              <div key={field} className="performance-metric">
                <div className="performance-label">{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                <div className="performance-value">{count}</div>
                <div className="performance-percentage">{((count / overall.totalRecords) * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>

        {classBreakdown.length > 0 && (
          <div className="class-summary">
            <h3>Class-wise Summary</h3>
            <div className="class-cards">
              {classBreakdown.map(cls => (
                <div key={cls.classId} className="class-card">
                  <h4>{cls.className}</h4>
                  <div className="class-stats">
                    <div className="stat-row">
                      <span>Records:</span>
                      <strong>{cls.totalRecords}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Students:</span>
                      <strong>{cls.uniqueStudents}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Avg Score:</span>
                      <strong>{cls.averageMarks}/{overall.maxMarks} ({cls.averagePercentage}%)</strong>
                    </div>
                    <div className="stat-row">
                      <span>Present:</span>
                      <strong>{cls.attendance.present} ({((cls.attendance.present / cls.totalRecords) * 100).toFixed(1)}%)</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDetailedView = () => {
    if (!analytics) return null;

    const { classBreakdown, overall } = analytics;

    return (
      <div className="detailed-view">
        <h3>Detailed Class Performance</h3>
        {classBreakdown.map(cls => (
          <div key={cls.classId} className="detailed-class-section">
            <h4>{cls.className}</h4>
            <div className="detailed-stats">
              <div className="stat-group">
                <h5>Overview</h5>
                <p>Total Records: <strong>{cls.totalRecords}</strong></p>
                <p>Unique Students: <strong>{cls.uniqueStudents}</strong></p>
                <p>Average Score: <strong>{cls.averageMarks}/{overall.maxMarks} ({cls.averagePercentage}%)</strong></p>
              </div>
              
              <div className="stat-group">
                <h5>Attendance</h5>
                <p>Present: <strong>{cls.attendance.present}</strong> ({((cls.attendance.present / cls.totalRecords) * 100).toFixed(1)}%)</p>
                <p>Absent: <strong>{cls.attendance.absent}</strong> ({((cls.attendance.absent / cls.totalRecords) * 100).toFixed(1)}%)</p>
                <p>On Leave: <strong>{cls.attendance.on_leave}</strong> ({((cls.attendance.on_leave / cls.totalRecords) * 100).toFixed(1)}%)</p>
              </div>
              
              <div className="stat-group">
                <h5>Performance Breakdown</h5>
                {Object.entries(cls.performance).map(([field, count]) => (
                  <p key={field}>
                    {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: 
                    <strong> {count}</strong> ({((count / cls.totalRecords) * 100).toFixed(1)}%)
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderStudentsView = () => {
    if (!analytics) return null;

    const { studentBreakdown, overall } = analytics;

    return (
      <div className="students-view">
        <h3>Student Performance Rankings</h3>
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student Name</th>
                <th>Slot</th>
                <th>Classes</th>
                <th>Total Marks</th>
                <th>Avg Score</th>
                <th>Percentage</th>
                <th>Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {studentBreakdown.map((student, index) => (
                <tr key={student.studentId}>
                  <td className="rank-cell">
                    {index === 0 && <span className="medal gold">🥇</span>}
                    {index === 1 && <span className="medal silver">🥈</span>}
                    {index === 2 && <span className="medal bronze">🥉</span>}
                    {index > 2 && <span className="rank-number">{index + 1}</span>}
                  </td>
                  <td><strong>{student.studentName}</strong></td>
                  <td>{student.slotName}</td>
                  <td>{student.classesAttended}</td>
                  <td>{student.totalMarks.toFixed(1)}</td>
                  <td>{student.averageMarks}/{overall.maxMarks}</td>
                  <td>
                    <span className={`percentage-badge ${
                      student.averagePercentage >= 80 ? 'excellent' : 
                      student.averagePercentage >= 60 ? 'good' : 
                      student.averagePercentage >= 40 ? 'average' : 'poor'
                    }`}>
                      {student.averagePercentage}%
                    </span>
                  </td>
                  <td>
                    <span className={`attendance-badge ${
                      student.attendanceRate >= 80 ? 'excellent' : 
                      student.attendanceRate >= 60 ? 'good' : 'poor'
                    }`}>
                      {student.attendanceRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="students-performance">
      <div className="performance-header">
        <h2>Students Performance Analytics</h2>
        <div className="header-controls">
          <div className="class-filter">
            <label htmlFor="class-filter">Filter by Class:</label>
            <select
              id="class-filter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="view-tabs">
        <button
          className={`view-tab ${viewMode === 'summary' ? 'active' : ''}`}
          onClick={() => setViewMode('summary')}
        >
          Summary
        </button>
        <button
          className={`view-tab ${viewMode === 'detailed' ? 'active' : ''}`}
          onClick={() => setViewMode('detailed')}
        >
          Detailed
        </button>
        <button
          className={`view-tab ${viewMode === 'students' ? 'active' : ''}`}
          onClick={() => setViewMode('students')}
        >
          Student Rankings
        </button>
      </div>

      <div className="performance-content">
        {!analytics || analytics.overall.totalRecords === 0 ? (
          <div className="no-data">No student performance data available yet.</div>
        ) : (
          <>
            {viewMode === 'summary' && renderSummaryView()}
            {viewMode === 'detailed' && renderDetailedView()}
            {viewMode === 'students' && renderStudentsView()}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentsPerformance;
