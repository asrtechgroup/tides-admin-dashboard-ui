import React, { useEffect, useState } from 'react';
import UnitPriceTable from '@/components/admin/UnitPriceTable';
import UnitPriceDialog from '@/components/admin/UnitPriceDialog';
import ExchangeRateTable from '@/components/admin/ExchangeRateTable';
import ExchangeRateDialog from '@/components/admin/ExchangeRateDialog';
import UserTable from '@/components/admin/UserTable';
import UserDialog from '@/components/admin/UserDialog';
import {
  getUnitPrices,
  createUnitPrice,
  updateUnitPrice,
  deleteUnitPrice,
  getExchangeRates,
  createExchangeRate,
  updateExchangeRate,
  deleteExchangeRate,
  getUsers
} from '@/services/adminApi';


const AdminDashboard: React.FC = () => {
  const [unitPrices, setUnitPrices] = useState([]);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [users, setUsers] = useState([]);

  // Dialog state
  const [unitPriceDialog, setUnitPriceDialog] = useState<{ open: boolean; data?: any }>({ open: false });
  const [exchangeRateDialog, setExchangeRateDialog] = useState<{ open: boolean; data?: any }>({ open: false });
  const [userDialog, setUserDialog] = useState<{ open: boolean; data?: any }>({ open: false });
  // Handlers for create/edit/delete
  const handleUnitPriceEdit = (row: any) => setUnitPriceDialog({ open: true, data: row });
  const handleUnitPriceCreate = () => setUnitPriceDialog({ open: true });
  const handleUnitPriceDelete = async (row: any) => {
    if (window.confirm('Delete this unit price?')) {
      await deleteUnitPrice(row.id);
      setUnitPrices(await getUnitPrices());
    }
  };
  const handleUnitPriceSave = async (data: any) => {
    setUnitPriceDialog({ open: false });
    if (data.id) {
      await updateUnitPrice(data.id, data);
    } else {
      await createUnitPrice(data);
    }
    setUnitPrices(await getUnitPrices());
  };

  const handleExchangeRateEdit = (row: any) => setExchangeRateDialog({ open: true, data: row });
  const handleExchangeRateCreate = () => setExchangeRateDialog({ open: true });
  const handleExchangeRateDelete = async (row: any) => {
    if (window.confirm('Delete this exchange rate?')) {
      await deleteExchangeRate(row.id);
      setExchangeRates(await getExchangeRates());
    }
  };
  const handleExchangeRateSave = async (data: any) => {
    setExchangeRateDialog({ open: false });
    if (data.id) {
      await updateExchangeRate(data.id, data);
    } else {
      await createExchangeRate(data);
    }
    setExchangeRates(await getExchangeRates());
  };

  const handleUserEdit = (row: any) => setUserDialog({ open: true, data: row });
  const handleUserCreate = () => setUserDialog({ open: true });
  const handleUserDelete = (row: any) => {/* TODO: implement */};
  const handleUserSave = (data: any) => {
    setUserDialog({ open: false });
    // TODO: Save to backend and refresh
  };

  useEffect(() => {
    (async () => {
      try {
        const [unitPricesData, exchangeRatesData, usersData] = await Promise.all([
          getUnitPrices(),
          getExchangeRates(),
          getUsers()
        ]);
        setUnitPrices(unitPricesData);
        setExchangeRates(exchangeRatesData);
        setUsers(usersData);
      } catch (err) {
        // Show a simple error message, but don't crash the page
        alert('Failed to load admin data. Please check your connection or contact support.');
      }
    })();
  }, []);

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white rounded shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Unit Costs</h2>
            <button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={handleUnitPriceCreate}>Add</button>
          </div>
          <p className="mb-4">Manage unit prices for materials, labor, and equipment.</p>
          <UnitPriceTable data={unitPrices} onEdit={handleUnitPriceEdit} onDelete={handleUnitPriceDelete} />
          <UnitPriceDialog open={unitPriceDialog.open} onClose={() => setUnitPriceDialog({ open: false })} onSave={handleUnitPriceSave} initialData={unitPriceDialog.data} />
        </section>
        <section className="bg-white rounded shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Exchange Rates</h2>
            <button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={handleExchangeRateCreate}>Add</button>
          </div>
          <p className="mb-4">Manage currency exchange rates for cost calculations.</p>
          <ExchangeRateTable data={exchangeRates} onEdit={handleExchangeRateEdit} onDelete={handleExchangeRateDelete} />
          <ExchangeRateDialog open={exchangeRateDialog.open} onClose={() => setExchangeRateDialog({ open: false })} onSave={handleExchangeRateSave} initialData={exchangeRateDialog.data} />
        </section>
        <section className="bg-white rounded shadow p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">User Management</h2>
            <button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={handleUserCreate}>Add</button>
          </div>
          <p className="mb-4">Manage users and assign roles (Admin, Engineer, Planner, Viewer).</p>
          <UserTable data={users} />
          <UserDialog open={userDialog.open} onClose={() => setUserDialog({ open: false })} onSave={handleUserSave} initialData={userDialog.data} />
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
