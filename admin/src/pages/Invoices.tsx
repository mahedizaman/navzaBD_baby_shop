

const Invoices = () => {
  const invoiceData = [
    {
      id: "INV-2024-001",
      client: "Arif Rahman",
      date: "Mar 01, 2024",
      amount: "$450.00",
      status: "Paid",
      dueDate: "Mar 10, 2024",
    },
    {
      id: "INV-2024-002",
      client: "Sultana Kamal",
      date: "Mar 02, 2024",
      amount: "$1,200.50",
      status: "Overdue",
      dueDate: "Mar 05, 2024",
    },
    {
      id: "INV-2024-003",
      client: "Mahmudul Hasan",
      date: "Mar 04, 2024",
      amount: "$320.00",
      status: "Paid",
      dueDate: "Mar 14, 2024",
    },
    {
      id: "INV-2024-004",
      client: "Nusrat Jahan",
      date: "Mar 05, 2024",
      amount: "$890.00",
      status: "Draft",
      dueDate: "Mar 20, 2024",
    },
    {
      id: "INV-2024-005",
      client: "Tanvir Ahmed",
      date: "Mar 06, 2024",
      amount: "$2,100.00",
      status: "Paid",
      dueDate: "Mar 16, 2024",
    },
    {
      id: "INV-2024-006",
      client: "Sajid Islam",
      date: "Mar 07, 2024",
      amount: "$150.00",
      status: "Paid",
      dueDate: "Mar 17, 2024",
    },
    {
      id: "INV-2024-007",
      client: "Farhana Akter",
      date: "Mar 08, 2024",
      amount: "$560.75",
      status: "Overdue",
      dueDate: "Mar 09, 2024",
    },
    {
      id: "INV-2024-008",
      client: "Rashed Khan",
      date: "Mar 09, 2024",
      amount: "$1,050.00",
      status: "Paid",
      dueDate: "Mar 19, 2024",
    },
    {
      id: "INV-2024-009",
      client: "Mitu Chowdhury",
      date: "Mar 10, 2024",
      amount: "$75.00",
      status: "Draft",
      dueDate: "Mar 25, 2024",
    },
    {
      id: "INV-2024-010",
      client: "Kamrul Islam",
      date: "Mar 11, 2024",
      amount: "$430.00",
      status: "Paid",
      dueDate: "Mar 21, 2024",
    },
  ];

  // Status Badge Logic
  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Overdue":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "Draft":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Invoices</h1>
          <p className="text-slate-500 font-medium">
            Manage your billing and client payments effortlessly.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            Download All
          </button>
          <button className="px-5 py-2.5 bg-blue-600 rounded-xl font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            + Create Invoice
          </button>
        </div>
      </div>

      {/* Invoice Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">
            Recent Transactions
          </h2>
          <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2 w-full max-w-xs">
            <span className="text-slate-400 mr-2">🔍</span>
            <input
              type="text"
              placeholder="Search by client or ID..."
              className="bg-transparent border-none text-sm focus:ring-0 w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoiceData.map((inv) => (
                <tr
                  key={inv.id}
                  className="group hover:bg-blue-50/30 transition-all duration-200"
                >
                  <td className="px-6 py-5 font-bold text-blue-600 text-sm">
                    {inv.id}
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-semibold text-slate-800">
                      {inv.client}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-sm">
                    {inv.date}
                  </td>
                  <td className="px-6 py-5 font-black text-slate-900">
                    {inv.amount}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold border ${getStatusStyle(inv.status)}`}
                    >
                      {inv.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-sm font-medium">
                    {inv.dueDate}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-blue-600 shadow-sm border border-transparent hover:border-slate-100">
                      📄
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Visual Only) */}
        <div className="p-5 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <p className="text-xs text-slate-500">Showing 10 of 48 invoices</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-bold border border-slate-200 rounded-lg hover:bg-white transition-all text-slate-600">
              Prev
            </button>
            <button className="px-3 py-1 text-xs font-bold border border-slate-200 rounded-lg hover:bg-white transition-all text-slate-600">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
