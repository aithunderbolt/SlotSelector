import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as XLSX from 'xlsx';
import UserManagement from './UserManagement';
import SlotManagement from './SlotManagement';
import './AdminDashboard.css';

const MAX_REGISTRATIONS_PER_SLOT = 15;

const AdminDashboard = ({ onLogout, user }) => {
  const [registrations, setRegistrations] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slotFilter, setSlotFilter] = useState(user.role === 'super_admin' ? 'all' : user.assigned_slot_id);
  const [activeTab, setActiveTab] = useState('registrations');

  const isSlotAdmin = user.role === 'slot_admin';
  const isSuperAdmin = user.role === 'super_admin';
  const userSlotId = user.assigned_slot_id;

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch slots
      const { data: slotsData, error: slotsError } = await supabase
        .from('slots')
        .select('*')
        .order('slot_order', { ascending: true });

      if (slotsError) throw slotsError;
      setSlots(slotsData);

      // Fetch all registrations for slot counts (both super admin and slot admin need this)
      const { data: allRegistrations, error: allRegError } = await supabase
        .from('registrations')
        .select('id, slot_id');

      if (allRegError) throw allRegError;

      // Fetch detailed registrations with slot info
      let query = supabase
        .from('registrations')
        .select(`
          *,
          slots (
            id,
            display_name
          )
        `)
        .order('created_at', { ascending: false });

      if (isSlotAdmin) {
        query = query.eq('slot_id', userSlotId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // For slot admins, use all registrations for counts but filtered data for table
      setRegistrations(isSlotAdmin ? { detailed: data, all: allRegistrations } : data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const registrationsChannel = supabase
      .channel('admin-registrations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
        () => {
          fetchData();
        }
      )
      .subscribe();

    const slotsChannel = supabase
      .channel('admin-slots')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'slots' },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(registrationsChannel);
      supabase.removeChannel(slotsChannel);
    };
  }, []);

  const getSlotCounts = () => {
    const counts = {};
    slots.forEach((slot) => {
      counts[slot.id] = 0;
    });
    
    // Use all registrations for counts if slot admin, otherwise use regular registrations
    const dataForCounts = isSlotAdmin ? (registrations.all || []) : (Array.isArray(registrations) ? registrations : []);
    
    dataForCounts.forEach((reg) => {
      if (counts[reg.slot_id] !== undefined) {
        counts[reg.slot_id]++;
      }
    });
    return counts;
  };

  const slotCounts = getSlotCounts();

  // Use detailed registrations for slot admin, regular for super admin
  const detailedRegistrations = isSlotAdmin ? (registrations.detailed || []) : (Array.isArray(registrations) ? registrations : []);
  
  const filteredRegistrations = slotFilter === 'all'
    ? detailedRegistrations
    : detailedRegistrations.filter((reg) => reg.slot_id === slotFilter);

  const getSlotDisplayName = (slotId) => {
    const slot = slots.find(s => s.id === slotId);
    return slot ? slot.display_name : 'Unknown Slot';
  };

  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  const downloadExcel = (dataToExport, filename) => {
    const exportData = dataToExport.map((reg) => ({
      Name: reg.name,
      "Father's Name": reg.fathers_name || '',
      'Date of Birth': formatDateToDDMMYYYY(reg.date_of_birth),
      Email: reg.email,
      'WhatsApp Mobile': reg.whatsapp_mobile,
      'Level of Tajweed': reg.tajweed_level || '',
      'Time Slot': reg.slots?.display_name || getSlotDisplayName(reg.slot_id),
      'Registered At': new Date(reg.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

    const colWidths = [
      { wch: 20 }, // Name
      { wch: 20 }, // Father's Name
      { wch: 15 }, // Date of Birth
      { wch: 30 }, // Email
      { wch: 20 }, // WhatsApp Mobile
      { wch: 15 }, // Level of Tajweed
      { wch: 15 }, // Time Slot
      { wch: 20 }, // Registered At
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, filename);
  };

  const handleDownloadAll = () => {
    const dataToDownload = Array.isArray(registrations) ? registrations : (registrations.detailed || []);
    downloadExcel(dataToDownload, 'all_registrations.xlsx');
  };

  const handleDownloadFiltered = () => {
    if (slotFilter === 'all') {
      const dataToDownload = Array.isArray(registrations) ? registrations : (registrations.detailed || []);
      downloadExcel(dataToDownload, 'all_registrations.xlsx');
    } else {
      const slotName = getSlotDisplayName(slotFilter);
      downloadExcel(
        filteredRegistrations,
        `${slotName.replace(/\s+/g, '_')}_registrations.xlsx`
      );
    }
  };

  if (loading) {
    return <div className="loading">Loading registrations...</div>;
  }

  const userSlotName = isSlotAdmin ? getSlotDisplayName(userSlotId) : '';

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="user-info">
            Logged in as: <strong>{user.username}</strong> ({user.role === 'super_admin' ? 'Super Admin' : `Slot Admin - ${userSlotName}`})
          </p>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>

      {isSuperAdmin && (
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            Registrations
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </button>
          <button
            className={`tab ${activeTab === 'slots' ? 'active' : ''}`}
            onClick={() => setActiveTab('slots')}
          >
            Slot Management
          </button>
        </div>
      )}

      {activeTab === 'registrations' && (
        <>
          <div className="stats-container">
            <div 
              className={`stat-card ${!isSlotAdmin && slotFilter === 'all' ? 'selected' : ''}`}
              onClick={() => !isSlotAdmin && setSlotFilter('all')}
              style={{ cursor: !isSlotAdmin ? 'pointer' : 'default' }}
            >
              <h3>Total Registrations</h3>
              <p className="stat-number">{isSlotAdmin ? (registrations.all || []).length : registrations.length}</p>
            </div>
            {slots.map((slot) => (
              <div 
                key={slot.id} 
                className={`stat-card ${slotCounts[slot.id] >= MAX_REGISTRATIONS_PER_SLOT ? 'full' : ''} ${!isSlotAdmin && slotFilter === slot.id ? 'selected' : ''}`}
                onClick={() => !isSlotAdmin && setSlotFilter(slot.id)}
                style={{ cursor: !isSlotAdmin ? 'pointer' : 'default' }}
              >
                <h3>{slot.display_name}</h3>
                <p className="stat-number">{slotCounts[slot.id]}/{MAX_REGISTRATIONS_PER_SLOT}</p>
              </div>
            ))}
          </div>

      {!isSlotAdmin && (
        <div className="filter-section">
          <div className="filter-controls">
            <h3>Showing: {slotFilter === 'all' ? 'All Slots' : getSlotDisplayName(slotFilter)}</h3>
          </div>
          <div className="download-buttons">
            <button onClick={handleDownloadAll} className="download-btn">
              Download All
            </button>
            <button onClick={handleDownloadFiltered} className="download-btn secondary">
              Download {slotFilter === 'all' ? 'All' : getSlotDisplayName(slotFilter)}
            </button>
          </div>
        </div>
      )}

      {isSlotAdmin && (
        <div className="filter-section">
          <div className="filter-controls">
            <h3>{userSlotName} Registrations</h3>
          </div>
          <div className="download-buttons">
            <button onClick={handleDownloadFiltered} className="download-btn">
              Download {userSlotName} Data
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
              <th>Father's Name</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>WhatsApp Mobile</th>
              <th>Level of Tajweed</th>
              <th>Time Slot</th>
              <th>Registered At</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">No registrations found</td>
              </tr>
            ) : (
              filteredRegistrations.map((reg) => (
                <tr key={reg.id}>
                  <td>{reg.name}</td>
                  <td>{reg.fathers_name || '-'}</td>
                  <td>{formatDateToDDMMYYYY(reg.date_of_birth) || '-'}</td>
                  <td>{reg.email}</td>
                  <td>{reg.whatsapp_mobile}</td>
                  <td>{reg.tajweed_level || '-'}</td>
                  <td><span className="slot-badge">{reg.slots?.display_name || getSlotDisplayName(reg.slot_id)}</span></td>
                  <td>{new Date(reg.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
          </div>
        </>
      )}

      {activeTab === 'users' && isSuperAdmin && (
        <UserManagement />
      )}

      {activeTab === 'slots' && isSuperAdmin && (
        <SlotManagement />
      )}
    </div>
  );
};

export default AdminDashboard;
