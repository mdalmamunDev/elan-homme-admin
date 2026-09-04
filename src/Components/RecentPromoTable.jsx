import React from 'react';

const RecentPromoTable = ({ promos }) => {
  return (
    <div className="mt-6 border border-gray-300 rounded-lg overflow-x-auto">
      <h3 className="text-lg font-semibold px-4 py-3 border-b border-gray-300 rounded-t-lg">
        Recent Promo Codes
      </h3>

      <table className="min-w-full text-left table-auto">
        <thead>
          <tr className="bg-s-1 text-white">
            <th className="px-6 py-3">#SL</th>
            <th className="px-6 py-3">Promo Code</th>
            <th className="px-6 py-3">Value</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Usage Count</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Ex. Date</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {promos.map((promo, index) => (
            <tr key={promo.id || index} className="border-b border-gray-200">
              <td className="px-6 py-3">{index + 1}</td>
              <td className="px-6 py-3">{promo.code || "N/A"}</td>
              <td className="px-6 py-3">{promo.value || "N/A"}</td>
              <td className="px-6 py-3">{promo.type || "N/A"}</td>
              <td className="px-6 py-3">{promo.usageCount || "N/A"}</td>
              <td className="px-6 py-3">
                <span className={`px-1 py-0.5 rounded-md ${ promo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {promo.status}
                </span>
              </td>
              <td className="px-6 py-3">{new Date(promo.expireDate).toLocaleDateString() || "N/A"}</td>
              <td className="px-6 py-3">{promo.ago || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentPromoTable;
