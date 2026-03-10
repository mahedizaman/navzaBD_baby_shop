
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const data = [
    { name: "Total Users", value: 400 },
    { name: "Active Products", value: 300 },
    { name: "Total Orders", value: 1284 },
    { name: "Net Revenue", value: 100 },
  ];

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#F43F5E"];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Grid Layout for Stats and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl">
        {/* Left Side: Professional Stats Cards */}
        <div className="grid grid-cols-1 gap-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">
                  {item.name}
                </p>
                <p className="text-2xl font-bold text-gray-800 tracking-tight">
                  {item.value.toLocaleString()}
                </p>
              </div>
              <div
                className="w-3 h-12 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
            </div>
          ))}
        </div>

        {/* Right Side: Advanced Donut Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Distribution Analysis
            </h2>
            <select className="text-sm border-none bg-gray-100 rounded-lg p-2 focus:ring-0">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={85} // Donut effect
                  outerRadius={120}
                  paddingAngle={8} // Slices er majhe faka
                  dataKey="value"
                  stroke="none" // Borderless clean look
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index]}
                      style={{
                        filter: `drop-shadow(0px 4px 6px ${COLORS[index]}44)`,
                      }} // Glow effect
                    />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-gray-600 font-medium px-2">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text for Donut Chart */}
            <div className="absolute top-[57%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-3xl font-bold text-gray-800">2084</p>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                Total Units
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
