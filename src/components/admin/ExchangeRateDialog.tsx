import React, { useState, useEffect } from 'react';

interface ExchangeRateFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const defaultData = {
  currency: '',
  rate_to_tzs: '',
  effective_date: '',
};

const ExchangeRateDialog: React.FC<ExchangeRateFormProps> = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(defaultData);

  useEffect(() => {
    setForm(initialData || defaultData);
  }, [initialData, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{initialData ? 'Edit' : 'Add'} Exchange Rate</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Currency</label>
            <input className="w-full border rounded p-2" value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Rate to TZS</label>
            <input type="number" className="w-full border rounded p-2" value={form.rate_to_tzs} onChange={e => setForm(f => ({ ...f, rate_to_tzs: e.target.value }))} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Effective Date</label>
            <input type="date" className="w-full border rounded p-2" value={form.effective_date} onChange={e => setForm(f => ({ ...f, effective_date: e.target.value }))} required />
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

export default ExchangeRateDialog;
