import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as XLSX from 'xlsx';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout, user }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slotFilter, setSlotFilter] = useState(user.role === 'super_admin' ? 'all' : user.assigned_slot);

  const isSlotAdmin = user.role === 'slot_admin';
  const userSlot = user.assigned_slot;

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (isSlotAdmin) {
        query = query.eq('time_slot', userSlot);
      }

      const { data, error } = await query;

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

  const downloadExcel = (dataToExport, filename) => {
    const exportData = dataToExport.map((reg) => ({
      Name: reg.name,
      Email: reg.email,
      'WhatsApp Mobile': reg.whatsapp_mobile,
      'Time Slot': reg.time_slot,
      'Registered At': new Date(reg.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    const colWidths = [
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, filename);
  };

  const handleDownloadAll = () => {
    downloadExcel(registrations, 'all_registrations.xlsx');
  };

  const handleDownloadFiltered = () => {
    if (slotFilter === 'all') {
      downloadExcel(registrations, 'all_registrations.xlsx');
    } else {
      downloadExcel(
        filteredRegistrations,
        `${slotFilter.replace(' ', '_')}_registrations.xlsx`
      );
    }
  };

  if (loading) {
    return <div className="loading">Loading registrations...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="user-info">
            Logged in as: <strong>{user.username}</strong> ({user.role === 'super_admin' ? 'Super Admin' : `Slot Admin - ${userSlot}`})
          </p>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>{isSlotAdmin ? `${userSlot} Registrations` : 'Total Registrations'}</h3>
          <p className="stat-number">{registrations.length}</p>
        </div>
        {!isSlotAdmin && Object.entries(slotCounts).map(([slot, count]) => (
          <div key={slot} className={`stat-card ${count >= 2 ? 'full' : ''}`}>
            <h3>{slot}</h3>
            <p className="stat-number">{count}/2</p>
          </div>
        ))}
        {isSlotAdmin && (
          <div className={`stat-card ${slotCounts[userSlot] >= 2 ? 'full' : ''}`}>
            <h3>Capacity</h3>
            <p className="stat-number">{slotCounts[userSlot]}/2</p>
          </div>
        )}
      </div>

      {!isSlotAdmin && (
        <div className="filter-section">
          <div className="filter-controls">
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
          <div className="download-buttons">
            <button onClick={handleDownloadAll} className="download-btn">
              Download All
            </button>
            <button onClick={handleDownloadFiltered} className="download-btn secondary">
              Download {slotFilter === 'all' ? 'All' : slotFilter}
            </button>
          </div>
        </div>
      )}

      {isSlotAdmin && (
        <div className="filter-section">
          <div className="filter-controls">
            <h3>{userSlot} Registrations</h3>
          </div>
          <div className="download-buttons">
            <button onClick={handleDownloadFiltered} className="download-btn">
              Download {userSlot} Data
            </button>
          </div>
        </div>
      )}

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
