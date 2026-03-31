import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Download } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

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
  total: number;
  status: string;
  createdAt?: string;
  items?: OrderItem[];
};

function customerLabel(order: OrderRow): string {
  const u = order.userId;
  if (u && typeof u === "object") {
    return u.name || u.email || "—";
  }
  return "—";
}

function formatDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function paymentBadge(status: string): {
  label: string;
  className: string;
} {
  const s = status.toLowerCase();
  if (s === "paid" || s === "completed") {
    return {
      label: "PAID",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  }
  if (s === "pending") {
    return {
      label: "PENDING",
      className: "bg-amber-100 text-amber-700 border-amber-200",
    };
  }
  return {
    label: s.toUpperCase(),
    className: "bg-slate-100 text-slate-700 border-slate-200",
  };
}

async function generateInvoicePdf(order: OrderRow) {
  // lazy-import jsPDF to keep bundle lean
  // @ts-ignore jsPDF types provided via runtime dependency only
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  const colLeft = 14;
  let y = 18;

  doc.setFontSize(18);
  doc.text("NavzaBD Invoice", colLeft, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Invoice ID: ${order._id}`, colLeft, y);
  y += 6;
  doc.text(`Customer: ${customerLabel(order)}`, colLeft, y);
  y += 6;
  doc.text(`Date: ${formatDate(order.createdAt)}`, colLeft, y);
  y += 10;

  doc.setFontSize(12);
  doc.text("Items", colLeft, y);
  y += 6;

  doc.setFontSize(10);
  const items = order.items ?? [];
  if (items.length === 0) {
    doc.text("No line items available.", colLeft, y);
    y += 6;
  } else {
    doc.text("Name", colLeft, y);
    doc.text("Qty", 120, y);
    doc.text("Price", 150, y);
    y += 5;
    doc.line(colLeft, y, 190, y);
    y += 5;
    for (const it of items) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(it.name, colLeft, y);
      doc.text(String(it.quantity), 120, y, { align: "right" });
      doc.text(`৳${(it.price * it.quantity).toFixed(0)}`, 180, y, {
        align: "right",
      });
      y += 5;
    }
  }

  y += 8;
  doc.setFontSize(12);
  doc.text(`Total: ৳${order.total?.toFixed?.(0) ?? order.total}`, colLeft, y);
  y += 6;
  const badge = paymentBadge(order.status);
  doc.text(`Status: ${badge.label}`, colLeft, y);

  doc.save(`invoice-${order._id.slice(-8)}.pdf`);
}

const Invoices = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<OrderRow[]>("/api/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? String(err.response?.data?.message || err.message)
        : "Failed to load invoices.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const totalAmount = useMemo(
    () => orders.reduce((sum, o) => sum + (o.total || 0), 0),
    [orders],
  );

  async function handleDownload(order: OrderRow) {
    try {
      setDownloadingId(order._id);
      await generateInvoicePdf(order);
      toast.success("Invoice downloaded.");
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.message
          ? err.message
          : "Failed to generate invoice PDF.";
      toast.error(msg);
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Invoices
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-base">
            Manage your billing and client payments effortlessly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs md:text-sm">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              Total Orders:
            </span>
            <span className="font-bold text-slate-900">
              {orders.length.toLocaleString()}
            </span>
          </div>
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              Total Amount:
            </span>
            <span className="font-bold text-emerald-600">
              ৳{Math.round(totalAmount).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-base md:text-lg font-bold text-slate-800">
            Recent Invoices
          </h2>
          <div className="flex items-center bg-slate-100 rounded-xl px-3 py-1.5 md:px-4 md:py-2 w-full max-w-xs">
            <span className="text-slate-400 mr-2 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by customer or ID..."
              className="bg-transparent border-none text-xs md:text-sm focus:ring-0 w-full outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto text-xs md:text-sm">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <table className="min-w-full text-left">
              <thead className="bg-slate-50/50 text-slate-500 text-[11px] md:text-xs uppercase tracking-widest font-bold">
                <tr>
                  <th className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    Order ID
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    Customer
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    Amount
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    Payment Status
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-right whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const badge = paymentBadge(order.status);
                  return (
                    <tr
                      key={order._id}
                      className="group hover:bg-blue-50/30 transition-all duration-200"
                    >
                      <td className="px-3 md:px-6 py-3 md:py-4 font-mono text-[11px] md:text-xs text-blue-600 whitespace-nowrap">
                        {order._id.slice(-8)}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 truncate max-w-[120px] md:max-w-xs">
                          {customerLabel(order)}
                        </div>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-slate-500 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 font-bold text-slate-900 whitespace-nowrap">
                        ৳{order.total?.toFixed?.(0) ?? order.total}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-lg text-[10px] md:text-[11px] font-bold border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-right whitespace-nowrap">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="text-[11px] md:text-xs gap-1 md:gap-2"
                          onClick={() => void handleDownload(order)}
                          disabled={downloadingId === order._id}
                        >
                          {downloadingId === order._id ? (
                            <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                          ) : (
                            <Download className="h-3 w-3 md:h-4 md:w-4" />
                          )}
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 md:px-6 py-10 text-center text-slate-500 text-xs md:text-sm"
                    >
                      No invoices found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
