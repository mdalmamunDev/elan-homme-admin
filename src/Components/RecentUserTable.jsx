import React from 'react';

const RecentUserTable = ({ users }) => {
  return (
    <div className="mt-6 border border-gray-300 rounded-lg overflow-x-auto">
      <h3 className="text-lg font-semibold px-4 py-3 border-b border-gray-300 rounded-t-lg">
        Recent Users
      </h3>

      <table className="min-w-full text-left table-auto">
        <thead>
          <tr className="bg-s-1 text-white">
            <th className="px-6 py-3">#SL</th>
            <th className="px-6 py-3">User Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Address</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user.id || index} className="border-b border-gray-200">
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3">{user.name || "N/A"}</td>
              <td className="px-6 py-3">{user.email || "N/A"}</td>
              <td className="px-6 py-3">{user.address || "N/A"}</td>
              <td className="px-6 py-3">{user.ago || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentUserTable;
