import React from 'react';

interface ExchangeRate {
  id: number;
  currency: string;
  rate_to_tzs: number;
  effective_date: string;
  created_at: string;
  updated_at: string;
}

interface ExchangeRateTableProps {
  data: ExchangeRate[];
}

const ExchangeRateTable: React.FC<ExchangeRateTableProps> = ({ data }) => (
  <table className="min-w-full border text-sm">
    <thead className="bg-stone-100">
      <tr>
        <th className="p-2 border">Currency</th>
        <th className="p-2 border">Rate to TZS</th>
        <th className="p-2 border">Effective Date</th>
        <th className="p-2 border">Created</th>
        <th className="p-2 border">Updated</th>
        <th className="p-2 border">Actions</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row) => (
        <tr key={row.id} className="even:bg-stone-50">
          <td className="p-2 border">{row.currency}</td>
          <td className="p-2 border">{row.rate_to_tzs}</td>
          <td className="p-2 border">{row.effective_date}</td>
          <td className="p-2 border">{row.created_at}</td>
          <td className="p-2 border">{row.updated_at}</td>
          <td className="p-2 border">
            <button className="text-blue-600 hover:underline mr-2">Edit</button>
            <button className="text-red-600 hover:underline">Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ExchangeRateTable;
