

const Order = () => {
  const orders = [
    {
      id: "#ORD-9901",
      customer: "Arif Rahman",
      product: "iPhone 15 Pro",
      amount: "$1200",
      status: "Delivered",
      payment: "Paid",
    },
    {
      id: "#ORD-9902",
      customer: "Sultana Kamal",
      product: "MacBook Air M2",
      amount: "$1400",
      status: "Processing",
      payment: "Pending",
    },
    {
      id: "#ORD-9903",
      customer: "Mahmudul Hasan",
      product: "Sony WH-1000XM5",
      amount: "$350",
      status: "Shipped",
      payment: "Paid",
    },
    {
      id: "#ORD-9904",
      customer: "Nusrat Jahan",
      product: "Apple Watch S9",
      amount: "$399",
      status: "Cancelled",
      payment: "Refunded",
    },
    {
      id: "#ORD-9905",
      customer: "Tanvir Ahmed",
      product: "Logitech MX Master",
      amount: "$99",
      status: "Delivered",
      payment: "Paid",
    },
    {
      id: "#ORD-9906",
      customer: "Sajid Islam",
      product: "Samsung S24 Ultra",
      amount: "$1300",
      status: "Processing",
      payment: "Paid",
    },
    {
      id: "#ORD-9907",
      customer: "Farhana Akter",
      product: "Kindle Paperwhite",
      amount: "$150",
      status: "Shipped",
      payment: "Paid",
    },
    {
      id: "#ORD-9908",
      customer: "Rashed Khan",
      product: "DJI Mini 3 Pro",
      amount: "$750",
      status: "Pending",
      payment: "Pending",
    },
    {
      id: "#ORD-9909",
      customer: "Mitu Chowdhury",
      product: "iPad Pro M2",
      amount: "$899",
      status: "Delivered",
      payment: "Paid",
    },
    {
      id: "#ORD-9100",
      customer: "Kamrul Islam",
      product: "Keychron K2 V2",
      amount: "$85",
      status: "Shipped",
      payment: "Paid",
    },
  ];

  // Status Badge Styling Function
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Orders Management
          </h1>
          <p className="text-gray-500">
            View and manage customer orders and fulfillment
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-medium transition-all shadow-lg shadow-indigo-200">
          Export Report
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm font-medium uppercase">
            Total Orders
          </p>
          <p className="text-2xl font-bold text-gray-800">1,284</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm font-medium uppercase">
            Pending Fulfillment
          </p>
          <p className="text-2xl font-bold text-amber-500">24</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm font-medium uppercase">
            Total Revenue
          </p>
          <p className="text-2xl font-bold text-emerald-500">$48,290</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700 text-lg">Recent Orders</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search orders..."
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-indigo-600">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${order.payment === "Paid" ? "bg-green-500" : "bg-amber-400"}`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {order.payment}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-gray-400 hover:text-indigo-600 transition-colors font-medium text-sm">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Order;
