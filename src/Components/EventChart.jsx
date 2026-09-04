// import { DatePicker } from "antd";
// import { useState } from "react";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Rectangle,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import { useTransactionChartQuery } from "../redux/features/transaction/transactionApi";
// import { cn } from "../lib/utils";

// const chart = [
//   { month: "Jan", value: 100 },
//   { month: "Feb", value: 120 },
//   { month: "Mar", value: 90 },
//   { month: "Apr", value: 110 },
//   { month: "May", value: 130 },
//   { month: "Jun", value: 80 },
//   { month: "Jul", value: 140 },
//   { month: "Aug", value: 95 },
//   { month: "Sep", value: 125 },
//   { month: "Oct", value: 105 },
//   { month: "Nov", value: 115 },
//   { month: "Dec", value: 150 },
// ];

// const EventChart = ({ className }) => {
//   const [cartYear, setCartYear] = useState(new Date().getFullYear());
//   const { data } = useTransactionChartQuery([
//     {
//       name: "year",
//       value: cartYear,
//     },
//   ]);
//   const onChange = (date, dateString) => {
//     // console.log(date, dateString);
//     setCartYear(dateString);
//   };

//   return (
//     <div className={cn("rounded-lg pt-8 pb-4", className)}>
//       <div className="flex justify-between items-center px-6 mb-8">
//         <h4 className="text-[20px] text-hash">Event Ratio</h4>
//         <DatePicker placeholder="Year" onChange={onChange} style={{ border: "none", width: "80px" }} picker="year" />
//       </div>
//       <div className="w-full max-w-full overflow-hidden px-4 ">
//         <ResponsiveContainer width="100%" height={200}>
//           <BarChart
//             // data={data?.data || []}
//             data={chart}
//             margin={{
//               top: 5,
//               right: 30,
//               left: 0,
//               bottom: 5,
//             }}
//           >
//             <CartesianGrid
//               vertical={false}
//               strokeDasharray=""
//               stroke="#959393"
//             />
//             <XAxis
//               // axisLine={false}
//               dataKey="month"
//               tick={{ stroke: "#00D698", strokeWidth: 0 }}
//             />
//             <YAxis
//               axisLine={false}
//               tick={{ stroke: "#959393", strokeWidth: 0 }}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar
//               dataKey="value"
//               fill="black"
//               barSize={36}
//               activeBar={<Rectangle fill="black" stroke="#00D698" />}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default EventChart;
// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-300">
//         <p className="text-gray-600 font-semibold">{`Month: ${label}`}</p>
//         <p className="text-green-500 font-semibold">{`Income: ${payload[0].value}`}</p>
//       </div>
//     );
//   }
//   return null;
// };

import { DatePicker } from "antd";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEventChartQuery } from "../redux/features/transaction/transactionApi";
import { cn } from "../lib/utils";

const EventChart = ({ className }) => {
  // Default to current year.
  const [chartYear, setChartYear] = useState(new Date().getFullYear());
  
  // Build query parameters.
  const queryParams = [{ name: "year", value: String(chartYear) }];
  
  // Fetch event chart data.
  const { data, error, isLoading } = useEventChartQuery(queryParams);

  const onChange = (date, dateString) => {
    // DatePicker returns a moment object for picker="year".
    // Here, we update the chartYear with the selected year.
    setChartYear(dateString);
  };

  // Use API data if available; otherwise fallback to an empty array.
  const chartData = data?.data || [];

  return (
    <div className={cn("rounded-lg pt-8 pb-4", className)}>
      <div className="flex justify-between items-center px-6 mb-8">
        <h4 className="text-[20px] text-hash">Event Ratio</h4>
        <DatePicker
          placeholder="Year"
          onChange={onChange}
          style={{ border: "none", width: "80px" }}
          picker="year"
        />
      </div>
      <div className="w-full max-w-full overflow-hidden px-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading data</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 10,
              bottom: 50, // Increased bottom margin
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="" stroke="#959393" />
            <XAxis
              dataKey="month"
              interval={0}
              tickMargin={15}
              padding={{ left: 10, right: 10 }}
              tick={{
                angle: -35,       // Slightly smaller angle
                textAnchor: "end",
                fontSize: 12,
              }}
            />
            <YAxis axisLine={false} tick={{ stroke: "#959393", strokeWidth: 0 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="event"
              fill="black"
              barSize={36}
              activeBar={<Rectangle fill="black" stroke="#00D698" />}
            />
          </BarChart>
        </ResponsiveContainer>
        
        
        )}
      </div>
    </div>
  );
};

export default EventChart;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-300">
        <p className="text-gray-600 font-semibold">{`Month: ${label}`}</p>
        <p className="text-green-500 font-semibold">{`Events: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};
