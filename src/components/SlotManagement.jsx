import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './SlotManagement.css';

const SlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  const [newName, setNewName] = useState('');

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('slots')
        .select('*')
        .order('slot_order', { ascending: true });

      if (error) throw error;
      setSlots(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching slots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleEdit = (slot) => {
    setEditingSlot(slot.id);
    setNewName(slot.display_name);
  };

  const handleCancel = () => {
    setEditingSlot(null);
    setNewName('');
  };

  const handleSave = async (slotId) => {
    if (!newName.trim()) {
      setError('Slot name cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('slots')
        .update({ display_name: newName.trim() })
        .eq('id', slotId);

      if (error) throw error;

      setEditingSlot(null);
      setNewName('');
      fetchSlots();
    } catch (err) {
      setError(err.message);
      console.error('Error updating slot:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading slots...</div>;
  }

  return (
    <div className="slot-management">
      <div className="slot-management-header">
        <h2>Slot Management</h2>
        <p className="slot-info">Edit slot display names. Changes will reflect immediately across the entire application.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="slots-table-container">
        <table className="slots-table">
          <thead>
            <tr>
              <th>Slot Order</th>
              <th>Display Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td>
                  <span className="slot-order-badge">#{slot.slot_order}</span>
                </td>
                <td>
                  {editingSlot === slot.id ? (
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="slot-name-input"
                      autoFocus
                    />
                  ) : (
                    <span className="slot-name">{slot.display_name}</span>
                  )}
                </td>
                <td>
                  {editingSlot === slot.id ? (
                    <div className="action-buttons">
                      <button
                        onClick={() => handleSave(slot.id)}
                        className="save-btn-inline"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="cancel-btn-inline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(slot)}
                      className="edit-btn-inline"
                    >
                      Edit Name
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SlotManagement;
