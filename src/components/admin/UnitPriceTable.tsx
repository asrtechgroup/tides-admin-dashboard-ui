import React from 'react';

interface UnitPrice {
  id: number;
  description: string;
  unit: string;
  base_rate: number;
  adjusted_rate: number;
  created_at: string;
  updated_at: string;
}

interface UnitPriceTableProps {
  data: UnitPrice[];
  onEdit?: (row: UnitPrice) => void;
  onDelete?: (row: UnitPrice) => void;
}

const UnitPriceTable: React.FC<UnitPriceTableProps> = ({ data, onEdit, onDelete }) => (
  <table className="min-w-full border text-sm">
    <thead className="bg-stone-100">
      <tr>
        <th className="p-2 border">Description</th>
        <th className="p-2 border">Unit</th>
        <th className="p-2 border">Base Rate</th>
        <th className="p-2 border">Adjusted Rate</th>
        <th className="p-2 border">Created</th>
        <th className="p-2 border">Updated</th>
        <th className="p-2 border">Actions</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row) => (
        <tr key={row.id} className="even:bg-stone-50">
          <td className="p-2 border">{row.description}</td>
          <td className="p-2 border">{row.unit}</td>
          <td className="p-2 border">{row.base_rate}</td>
          <td className="p-2 border">{row.adjusted_rate}</td>
          <td className="p-2 border">{row.created_at}</td>
          <td className="p-2 border">{row.updated_at}</td>
          <td className="p-2 border">
            <button className="text-blue-600 hover:underline mr-2" onClick={() => onEdit && onEdit(row)}>Edit</button>
            <button className="text-red-600 hover:underline" onClick={() => onDelete && onDelete(row)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default UnitPriceTable;
