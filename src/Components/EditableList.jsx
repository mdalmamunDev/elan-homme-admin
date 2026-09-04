import React, { useState } from 'react';
import Swal from 'sweetalert2';
import PageHeading from './PageHeading';
import { FaTrash } from 'react-icons/fa6';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const EditableList = ({ title, placeholder, items, onAdd, onUpdate, onDelete }) => {
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const startEditing = (item) => {
    setEditingItem(item);
    setEditingValue(item.name);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditingValue('');
  };

  const saveEditing = async () => {
    if (!editingItem || editingValue.trim() === '') return;
    try {
      await onUpdate(editingItem._id, { name: editingValue });
      toast.success('Item updated successfully');
      cancelEditing();
    } catch (error) {
      Swal.fire('Failed', 'Error updating item.', 'error');
    }
  };

  const addNewItem = async () => {
    if (newItem.trim() === '') return;
    try {
      await onAdd({ "name": newItem });
      toast.success('Item added successfully');
      setNewItem('');
    } catch (error) {
      Swal.fire('Failed', 'Error adding item.', 'error');
    }
  };

  const deleteItem = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });
    if (!result.isConfirmed) return;
    try {
      await onDelete(id);
      toast.success('Item deleted successfully');
    } catch (error) {
      Swal.fire('Failed', 'Error deleting item.', 'error');
    }
  };

  return (
    <div className="py-[16px]">
      {/* Page heading and search controls */}
      <div className="p-2 flex justify-between items-center bg-4">
        <PageHeading title={title} disbaledBackBtn={true} />
      </div>
      <div className="max-w-4xl mx-auto py-6 px-4">
        <h1 className="mb-4 font-bold text-xl">{title}</h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder={placeholder}
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            className="flex-grow rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button onClick={addNewItem} className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700">
            + Add
          </button>
        </div>

        <div className="space-y-3">
          {items.map(item => (
            <div key={item._id} className="flex items-center gap-2">
              {editingItem?._id === item._id ? (
                <>
                  <input
                    value={editingValue}
                    onChange={e => setEditingValue(e.target.value)}
                    className="flex-grow rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    onClick={saveEditing}
                    className="bg-blue-600 text-white px-3 rounded-md hover:bg-blue-700 flex items-center justify-center h-10"
                    aria-label="Save"
                  >
                    <FaSave />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-3 rounded-md border border-gray-300 hover:bg-gray-100 flex items-center justify-center h-10"
                    aria-label="Cancel"
                  >
                    <FaTimes />
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={item.name}
                    readOnly
                    className="flex-grow rounded-md border border-gray-300 px-4 py-2 text-gray-700 cursor-not-allowed"
                  />
                  <button
                    onClick={() => startEditing(item)}
                    className="px-3 rounded-md border border-gray-300 hover:bg-gray-100 flex items-center justify-center h-10"
                    aria-label="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="px-3 rounded-md border border-red-500 text-red-500 hover:bg-red-50 flex items-center justify-center h-10"
                    aria-label="Delete"
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditableList;
