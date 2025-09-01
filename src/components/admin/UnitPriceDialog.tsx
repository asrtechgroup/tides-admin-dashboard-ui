import React, { useState, useEffect } from 'react';

interface UnitPriceFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const defaultData = {
  description: '',
  unit: '',
  base_rate: '',
  adjusted_rate: '',
};

const UnitPriceDialog: React.FC<UnitPriceFormProps> = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(defaultData);

  useEffect(() => {
    setForm(initialData || defaultData);
  }, [initialData, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{initialData ? 'Edit' : 'Add'} Unit Price</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <input className="w-full border rounded p-2" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Unit</label>
            <input className="w-full border rounded p-2" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Base Rate</label>
            <input type="number" className="w-full border rounded p-2" value={form.base_rate} onChange={e => setForm(f => ({ ...f, base_rate: e.target.value }))} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Adjusted Rate</label>
            <input type="number" className="w-full border rounded p-2" value={form.adjusted_rate} onChange={e => setForm(f => ({ ...f, adjusted_rate: e.target.value }))} required />
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

export default UnitPriceDialog;
