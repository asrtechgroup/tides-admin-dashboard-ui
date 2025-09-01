import React from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
}

interface UserTableProps {
  data: User[];
}

const UserTable: React.FC<UserTableProps> = ({ data }) => (
  <table className="min-w-full border text-sm">
    <thead className="bg-stone-100">
      <tr>
        <th className="p-2 border">Username</th>
        <th className="p-2 border">Email</th>
        <th className="p-2 border">Role</th>
        <th className="p-2 border">Active</th>
        <th className="p-2 border">Last Login</th>
        <th className="p-2 border">Actions</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row) => (
        <tr key={row.id} className="even:bg-stone-50">
          <td className="p-2 border">{row.username}</td>
          <td className="p-2 border">{row.email}</td>
          <td className="p-2 border">{row.role}</td>
          <td className="p-2 border">{row.is_active ? 'Yes' : 'No'}</td>
          <td className="p-2 border">{row.last_login || '-'}</td>
          <td className="p-2 border">
            <button className="text-blue-600 hover:underline mr-2">Edit</button>
            <button className="text-red-600 hover:underline">Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default UserTable;
