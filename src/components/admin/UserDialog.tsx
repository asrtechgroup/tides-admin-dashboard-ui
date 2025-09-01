import React, { useState, useEffect } from 'react';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const defaultData = {
  username: '',
  email: '',
  role: 'Viewer',
  is_active: true,
};

const UserDialog: React.FC<UserFormProps> = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(defaultData);

  useEffect(() => {
    setForm(initialData || defaultData);
  }, [initialData, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{initialData ? 'Edit' : 'Add'} User</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input className="w-full border rounded p-2" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" className="w-full border rounded p-2" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select className="w-full border rounded p-2" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="Admin">Admin</option>
              <option value="Engineer">Engineer</option>
              <option value="Planner">Planner</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Active</label>
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 bg-stone-200 rounded" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDialog;
