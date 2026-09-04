import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const EarningsChart = ({ earningChart, selectedYear, selectedMonth, setSelectedYear, setSelectedMonth }) => {
  // const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };
  const earningChart2 = [
  { month: "Jan", earnings: 12000 },
  { month: "Feb", earnings: 15000 },
  { month: "Mar", earnings: 11000 },
  { month: "Apr", earnings: 18000 },
  { month: "May", earnings: 20000 },
  { month: "Jun", earnings: 17000 },
  { month: "Jul", earnings: 22000 },
  { month: "Aug", earnings: 19000 },
  { month: "Sep", earnings: 25000 },
  { month: "Oct", earnings: 23000 },
  { month: "Nov", earnings: 21000 },
  { month: "Dec", earnings: 26000 },
];

  // Generate year options (e.g., past 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Earnings</h2>

          <div className="flex items-center gap-2">
           {/* Year Select */}
          <select
            className="px-3 py-1 text-sm"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={earningChart2} width={600} height={300}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#56E1E8" />
              <stop offset="100%" stopColor="#8e00ff" />
            </linearGradient>
          </defs>

          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#666" }} />
          <YAxis
            tickFormatter={value => `${value / 1000}k`}
            tick={{ fontSize: 12, fill: "#666" }}
          />

          {/* Horizontal dashed grid lines */}
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#ccc" />

          <Tooltip formatter={value => `$${value.toLocaleString()}`} />
          <Bar
            dataKey="earnings"
            fill="url(#barGradient)"
            barSize={20}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>

      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
