import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slotFilter, setSlotFilter] = useState('all');

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();

    const channel = supabase
      .channel('admin-registrations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
        () => {
          fetchRegistrations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getSlotCounts = () => {
    const counts = {};
    for (let i = 1; i <= 10; i++) {
      counts[`Slot ${i}`] = 0;
    }
    registrations.forEach((reg) => {
      if (counts[reg.time_slot] !== undefined) {
        counts[reg.time_slot]++;
      }
    });
    return counts;
  };

  const slotCounts = getSlotCounts();

  const filteredRegistrations = slotFilter === 'all'
    ? registrations
    : registrations.filter((reg) => reg.time_slot === slotFilter);

  if (loading) {
    return <div className="loading">Loading registrations...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Registrations</h3>
          <p className="stat-number">{registrations.length}</p>
        </div>
        {Object.entries(slotCounts).map(([slot, count]) => (
          <div key={slot} className={`stat-card ${count >= 2 ? 'full' : ''}`}>
            <h3>{slot}</h3>
            <p className="stat-number">{count}/2</p>
          </div>
        ))}
      </div>

      <div className="filter-section">
        <label htmlFor="slot-filter">Filter by Slot:</label>
        <select
          id="slot-filter"
          value={slotFilter}
          onChange={(e) => setSlotFilter(e.target.value)}
        >
          <option value="all">All Slots</option>
          {Object.keys(slotCounts).map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="registrations-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>WhatsApp Mobile</th>
              <th>Time Slot</th>
              <th>Registered At</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No registrations found</td>
              </tr>
            ) : (
              filteredRegistrations.map((reg) => (
                <tr key={reg.id}>
                  <td>{reg.name}</td>
                  <td>{reg.email}</td>
                  <td>{reg.whatsapp_mobile}</td>
                  <td><span className="slot-badge">{reg.time_slot}</span></td>
                  <td>{new Date(reg.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
