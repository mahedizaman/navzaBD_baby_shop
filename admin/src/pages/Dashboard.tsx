import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";

type Stats = {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers?: number;
};

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#F43F5E"];

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Stats>("/api/stats");
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setError("Could not load dashboard stats.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sales = stats?.totalSales ?? stats?.totalRevenue ?? 0;
  const chartData = stats
    ? [
        { name: "Total Sales (৳)", value: Math.round(sales) },
        { name: "Total Orders", value: stats.totalOrders },
        { name: "Products", value: stats.totalProducts },
        { name: "Users", value: stats.totalUsers ?? 0 },
      ]
    : [];

  const cards = stats
    ? [
        { name: "Total Sales", value: Math.round(sales).toLocaleString(), suffix: "৳" },
        {
          name: "Total Orders",
          value: stats.totalOrders.toLocaleString(),
          suffix: "",
        },
        {
          name: "Total Products",
          value: stats.totalProducts.toLocaleString(),
          suffix: "",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center text-red-600 bg-gray-50 min-h-screen">
        {error || "No data"}
      </div>
    );
  }

  const chartTotal =
    chartData.reduce((a, b) => a + (Number(b.value) || 0), 0) || 1;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome back! Store overview from your API.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl">
        <div className="grid grid-cols-1 gap-4">
          {cards.map((item, index) => (
            <div
              key={item.name}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">
                  {item.name}
                </p>
                <p className="text-2xl font-bold text-gray-800 tracking-tight">
                  {item.suffix === "৳" ? `৳${item.value}` : item.value}
                </p>
              </div>
              <div
                className="w-3 h-12 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Distribution Analysis
          </h2>
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
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                      style={{
                        filter: `drop-shadow(0px 4px 6px ${COLORS[index % COLORS.length]}44)`,
                      }}
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
            <div className="absolute top-[57%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-3xl font-bold text-gray-800">
                {Math.round(chartTotal).toLocaleString()}
              </p>
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
