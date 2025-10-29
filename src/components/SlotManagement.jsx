import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './SlotManagement.css';

const SlotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  const [newName, setNewName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlotName, setNewSlotName] = useState('');
  const [newSlotOrder, setNewSlotOrder] = useState('');
  const [deletingSlot, setDeletingSlot] = useState(null);

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

  const handleAddSlot = async (e) => {
    e.preventDefault();
    
    if (!newSlotName.trim()) {
      setError('Slot name cannot be empty');
      return;
    }

    if (!newSlotOrder || newSlotOrder < 1) {
      setError('Slot order must be a positive number');
      return;
    }

    try {
      const { error } = await supabase
        .from('slots')
        .insert([
          {
            display_name: newSlotName.trim(),
            slot_order: parseInt(newSlotOrder)
          }
        ]);

      if (error) throw error;

      setShowAddForm(false);
      setNewSlotName('');
      setNewSlotOrder('');
      setError(null);
      fetchSlots();
    } catch (err) {
      setError(err.message);
      console.error('Error adding slot:', err);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      // Check if slot has any registrations
      const { data: registrations, error: checkError } = await supabase
        .from('registrations')
        .select('id')
        .eq('slot_id', slotId)
        .limit(1);

      if (checkError) throw checkError;

      if (registrations && registrations.length > 0) {
        setError('Cannot delete slot with existing registrations');
        return;
      }

      const { error } = await supabase
        .from('slots')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      setDeletingSlot(null);
      setError(null);
      fetchSlots();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting slot:', err);
    }
  };

  const confirmDelete = (slotId) => {
    setDeletingSlot(slotId);
  };

  const cancelDelete = () => {
    setDeletingSlot(null);
  };

  if (loading) {
    return <div className="loading">Loading slots...</div>;
  }

  return (
    <div className="slot-management">
      <div className="slot-management-header">
        <div>
          <h2>Slot Management</h2>
          <p className="slot-info">Add, edit, or delete time slots. Changes will reflect immediately across the entire application.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="add-slot-btn"
        >
          {showAddForm ? 'Cancel' : '+ Add New Slot'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && (
        <div className="add-slot-form">
          <h3>Add New Slot</h3>
          <form onSubmit={handleAddSlot}>
            <div className="form-group">
              <label htmlFor="slotName">Slot Display Name:</label>
              <textarea
                id="slotName"
                value={newSlotName}
                onChange={(e) => setNewSlotName(e.target.value)}
                placeholder="e.g., Monday - 5:00 PM to 6:00 PM"
                rows="3"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="slotOrder">Slot Order:</label>
              <input
                type="number"
                id="slotOrder"
                value={newSlotOrder}
                onChange={(e) => setNewSlotOrder(e.target.value)}
                placeholder="e.g., 1, 2, 3..."
                min="1"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Add Slot</button>
              <button 
                type="button" 
                onClick={() => {
                  setShowAddForm(false);
                  setNewSlotName('');
                  setNewSlotOrder('');
                  setError(null);
                }} 
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
                    <textarea
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="slot-name-input"
                      rows="3"
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
                  ) : deletingSlot === slot.id ? (
                    <div className="action-buttons">
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="confirm-delete-btn"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="cancel-btn-inline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(slot)}
                        className="edit-btn-inline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(slot.id)}
                        className="delete-btn-inline"
                      >
                        Delete
                      </button>
                    </div>
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
