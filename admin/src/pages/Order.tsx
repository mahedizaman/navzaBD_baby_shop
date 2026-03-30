import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";

type UserRef = { _id: string; name?: string; email?: string };

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderRow = {
  _id: string;
  userId: UserRef | string;
  items: OrderItem[];
  total: number;
  status: string;
  fulfillmentStatus?: string;
  createdAt?: string;
};

const FULFILLMENT_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
] as const;

function customerLabel(order: OrderRow): string {
  const u = order.userId;
  if (u && typeof u === "object") {
    return u.name || u.email || "—";
  }
  return "—";
}

function itemsSummary(items: OrderItem[] | undefined): string {
  if (!items?.length) return "—";
  if (items.length === 1) return items[0].name;
  return `${items[0].name} +${items.length - 1} more`;
}

function paymentLabel(status: string): string {
  if (status === "paid") return "Paid";
  if (status === "pending") return "Pending";
  return status;
}

const Order = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [stats, setStats] = useState<{
    totalOrders: number;
    totalRevenue: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [ordRes, statsRes] = await Promise.all([
      api.get<OrderRow[]>("/api/orders"),
      api.get<{
        totalOrders: number;
        totalRevenue: number;
      }>("/api/stats"),
    ]);
    setOrders(ordRes.data);
    setStats(statsRes.data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await load();
      } catch {
        if (!cancelled) toast.error("Failed to load orders.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function updateFulfillment(orderId: string, fulfillmentStatus: string) {
    setUpdatingId(orderId);
    try {
      await api.put(`/api/orders/${orderId}/fulfillment`, {
        fulfillmentStatus,
      });
      toast.success("Order status updated.");
      await load();
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String(
            err.response?.data &&
              typeof err.response.data === "object" &&
              "message" in err.response.data
              ? (err.response.data as { message: string }).message
              : err.message,
          )
        : "Update failed.";
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  }

  const pendingFulfillment = orders.filter(
    (o) => (o.fulfillmentStatus || "pending") === "pending",
  ).length;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Orders Management
          </h1>
          <p className="text-gray-500">
            Fulfillment workflow (payment status shown separately).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm font-medium uppercase">
            Total Orders
          </p>
          <p className="text-2xl font-bold text-gray-800">
            {stats ? stats.totalOrders.toLocaleString() : "—"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm font-medium uppercase">
            Pending Fulfillment
          </p>
          <p className="text-2xl font-bold text-amber-500">
            {loading ? "—" : pendingFulfillment}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm font-medium uppercase">
            Total Revenue (paid)
          </p>
          <p className="text-2xl font-bold text-emerald-500">
            {stats ? `৳${Math.round(stats.totalRevenue).toLocaleString()}` : "—"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-bold text-gray-700 text-lg">All orders</h3>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const ff =
                    order.fulfillmentStatus &&
                    FULFILLMENT_OPTIONS.some(
                      (o) => o.value === order.fulfillmentStatus,
                    )
                      ? order.fulfillmentStatus
                      : "pending";
                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-indigo-600">
                        {order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {customerLabel(order)}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm max-w-[200px] truncate">
                        {itemsSummary(order.items)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        ৳{order.total?.toFixed?.(0) ?? order.total}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"}`}
                        >
                          {paymentLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {updatingId === order._id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                          ) : null}
                          <select
                            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-800"
                            value={ff}
                            onChange={(e) =>
                              void updateFulfillment(
                                order._id,
                                e.target.value,
                              )
                            }
                            disabled={updatingId === order._id}
                          >
                            {FULFILLMENT_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
