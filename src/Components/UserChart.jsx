

// import { DatePicker } from "antd";
// import { useState } from "react";
// import { cn } from "../lib/utils";
// import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
// import { useDashboardStatusQuery } from "../redux/features/transaction/transactionApi";

// const UserChart = ({ className }) => {
//   // Default to current year; no month selected means show data for the whole year.
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState(null); // will store month name in lowercase

//   // When a month is selected, update both year and month states.
//   const handleMonthChange = (date, dateString) => {
//     if (date) {
//       // Use native Date methods to get year and month name.
//       const nativeDate = date.toDate ? date.toDate() : date; // In case date is a moment-like object with toDate()
//       setSelectedYear(nativeDate.getFullYear());
//       // Get full month name and convert to lowercase (e.g., "january")
//       const monthName = nativeDate.toLocaleString("default", { month: "long" }).toLowerCase();
//       setSelectedMonth(monthName);
//     } else {
//       // If date is cleared, revert to full-year view.
//       setSelectedMonth(null);
//     }
//   };

//   // Build the query parameters array.
//   const queryParams = [{ name: "year", value: String(selectedYear) }];
//   if (selectedMonth) {
//     queryParams.push({ name: "month", value: selectedMonth });
//   }

//   // Fetch dashboard stats with the given query parameters.
//   const { data, error, isLoading } = useDashboardStatusQuery(queryParams);

//   // Prepare pie chart data:
//   // - If a month is selected, use that month's breakdown from `userRatio[0]`
//   // - Otherwise, use overall totals.
//   let pieData = [];
//   if (!isLoading && data && data.data) {
//     if (selectedMonth) {
//       const monthStats = data.data.userRatio[0];
//       pieData = [
//         { name: "User", value: monthStats.user },
//         { name: "Manager", value: monthStats.manager },
//       ];
//     } else {
//       pieData = [
//         { name: "User", value: data.data.totalUsers },
//         { name: "Manager", value: data.data.totalManagers },
//       ];
//     }
//   }

//   return (
//     <div className={cn("bg-white rounded-lg pt-8 pb-4 drop-shadow-sm", className)}>
//       <div className="flex justify-between items-center px-6 mb-6">
//         <h4 className="text-[20px]">User Ratio</h4>
//         <DatePicker
//           placeholder="Select Month"
//           onChange={handleMonthChange}
//           style={{ border: "none", width: "100px" }}
//           picker="month"
//         />
//       </div>
//       <div className="w-full max-w-full overflow-hidden px-4 border-t pt-2">
//         {isLoading ? (
//           <div>Loading...</div>
//         ) : error ? (
//           <div>Error loading data</div>
//         ) : (
//           <ResponsiveContainer width="100%" height={200}>
//             <PieChart>
//               <Pie
//                 data={pieData}
//                 cx="40%"
//                 cy="50%"
//                 labelLine={false}
//                 label={renderCustomizedLabel}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {pieData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Legend
//                 content={<CustomLegend />}
//                 layout="vertical"
//                 align="right"
//                 verticalAlign="middle"
//                 wrapperStyle={{
//                   right: 0,
//                   top: "50%",
//                   transform: "translate(0, -50%)",
//                   marginRight: "7%",
//                 }}
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserChart;

// const COLORS = ["#000000", "#0088FE"];

// const RADIAN = Math.PI / 180;
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);

//   return (
//     <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };

// // Helper function to format values. Shows "K" if value is >= 1000.
// const formatValue = (value) => {
//   return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value;
// };

// // Custom legend for the chart
// const CustomLegend = (props) => {
//   const { payload } = props;
//   return (
//     <div className="space-y-2.5">
//       {payload.map((entry, index) => (
//         <div key={`item-${index}`} className="flex items-start justify-start space-x-2">
//           <div className="w-5 h-3.5" style={{ backgroundColor: entry.color }} />
//           <div className="space-y-1">
//             <p className="leading-3 text-sm text-hash">{entry.value}</p>
//             <p className="text-hash font-medium">{formatValue(entry.payload.value)}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };


import { DatePicker, Modal, Button } from "antd";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useDashboardStatusQuery } from "../redux/features/transaction/transactionApi";

const UserChart = ({ className }) => {
  // Default to current year; no month selected means show data for the whole year.
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null); // will store month name in lowercase
  const [isModalVisible, setIsModalVisible] = useState(false);

  // When a month is selected, update both year and month states.
  const handleMonthChange = (date, dateString) => {
    if (date) {
      // Use native Date methods to get year and month name.
      const nativeDate = date.toDate ? date.toDate() : date; // In case date is a moment-like object with toDate()
      setSelectedYear(nativeDate.getFullYear());
      // Get full month name and convert to lowercase (e.g., "january")
      const monthName = nativeDate.toLocaleString("default", { month: "long" }).toLowerCase();
      setSelectedMonth(monthName);
    } else {
      // If date is cleared, revert to full-year view.
      setSelectedMonth(null);
    }
  };

  // Build the query parameters array.
  const queryParams = [{ name: "year", value: String(selectedYear) }];
  if (selectedMonth) {
    queryParams.push({ name: "month", value: selectedMonth });
  }

  // Fetch dashboard stats with the given query parameters.
  const { data, error, isLoading } = useDashboardStatusQuery(queryParams);

  // Show modal when there is an error (i.e., session expired).
  useEffect(() => {
    if (error) {
      setIsModalVisible(true);
    }
  }, [error]);

  // Prepare pie chart data:
  // - If a month is selected, use that month's breakdown from `userRatio[0]`
  // - Otherwise, use overall totals.
  let pieData = [];
  if (!isLoading && data && data.data) {
    if (selectedMonth) {
      const monthStats = data.data.userRatio[0];
      pieData = [
        { name: "User", value: monthStats.user },
        { name: "Manager", value: monthStats.manager },
      ];
    } else {
      pieData = [
        { name: "User", value: data.data.totalUsers },
        { name: "Manager", value: data.data.totalManagers },
      ];
    }
  }

  return (
    <div className={cn("bg-white rounded-lg pt-8 pb-4 drop-shadow-sm", className)}>
      <div className="flex justify-between items-center px-6 mb-6">
        <h4 className="text-[20px]">User Ratio</h4>
        <DatePicker
          placeholder="Select Month"
          onChange={handleMonthChange}
          style={{ border: "none", width: "100px" }}
          picker="month"
        />
      </div>
      <div className="w-full max-w-full overflow-hidden px-4 border-t pt-2">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? null : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="40%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                content={<CustomLegend />}
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{
                  right: 0,
                  top: "50%",
                  transform: "translate(0, -50%)",
                  marginRight: "7%",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <Modal
        title="Session Expired"
        visible={isModalVisible}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="login"
            type="primary"
            onClick={() => {
              window.location.href = "/auth/sign-in";
            }}
          >
            Go to Login
          </Button>,
        ]}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Please login again, your session is expired.</p>
      </Modal>
    </div>
  );
};

export default UserChart;

const COLORS = ["#000000", "#0088FE"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Helper function to format values. Shows "K" if value is >= 1000.
const formatValue = (value) => {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value;
};

// Custom legend for the chart
const CustomLegend = (props) => {
  const { payload } = props;
  return (
    <div className="space-y-2.5">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-start justify-start space-x-2">
          <div className="w-5 h-3.5" style={{ backgroundColor: entry.color }} />
          <div className="space-y-1">
            <p className="leading-3 text-sm text-hash">{entry.value}</p>
            <p className="text-hash font-medium">{formatValue(entry.payload.value)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

