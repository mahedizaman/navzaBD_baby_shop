

const Brand = () => {
  const brands = [
    {
      id: 1,
      name: "Apple",
      category: "Electronics",
      items: 142,
      status: "Active",
      logo: "🍎",
    },
    {
      id: 2,
      name: "Samsung",
      category: "Electronics",
      items: 98,
      status: "Active",
      logo: "📱",
    },
    {
      id: 3,
      name: "Nike",
      category: "Apparel",
      items: 256,
      status: "Active",
      logo: "✔️",
    },
    {
      id: 4,
      name: "Adidas",
      category: "Apparel",
      items: 180,
      status: "Inactive",
      logo: "👟",
    },
    {
      id: 5,
      name: "Sony",
      category: "Entertainment",
      items: 64,
      status: "Active",
      logo: "🎮",
    },
    {
      id: 6,
      name: "Logitech",
      category: "Accessories",
      items: 45,
      status: "Active",
      logo: "🖱️",
    },
    {
      id: 7,
      name: "Dell",
      category: "Computing",
      items: 30,
      status: "Inactive",
      logo: "💻",
    },
    {
      id: 8,
      name: "Microsoft",
      category: "Software",
      items: 12,
      status: "Active",
      logo: "🪟",
    },
    {
      id: 9,
      name: "Asus",
      category: "Computing",
      items: 75,
      status: "Active",
      logo: "🖥️",
    },
    {
      id: 10,
      name: "Puma",
      category: "Apparel",
      items: 110,
      status: "Active",
      logo: "🐆",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Brand Directory
          </h1>
          <p className="text-gray-500">
            Manage your product brands and their market presence.
          </p>
        </div>
        <button className="bg-black text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-xl shadow-gray-200">
          <span>+</span> Add New Brand
        </button>
      </div>

      {/* Brand Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          >
            {/* Status Indicator */}
            <div
              className={`absolute top-4 right-4 w-2 h-2 rounded-full ${brand.status === "Active" ? "bg-green-500" : "bg-gray-300"}`}
            ></div>

            <div className="flex flex-col items-center text-center">
              {/* Logo Circle */}
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 border border-gray-50 shadow-inner">
                {brand.logo}
              </div>

              <h3 className="text-xl font-bold text-gray-800">{brand.name}</h3>
              <p className="text-sm font-medium text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full mt-2">
                {brand.category}
              </p>

              <div className="mt-6 w-full pt-6 border-t border-gray-50 flex justify-between items-center">
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                    Products
                  </p>
                  <p className="text-lg font-black text-gray-700">
                    {brand.items}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-black transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Summary Footer */}
      <div className="mt-12 bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-indigo-200">
        <div>
          <h2 className="text-2xl font-bold">Want to see more analytics?</h2>
          <p className="text-indigo-100 opacity-80 mt-1">
            Check out which brands are performing best this quarter.
          </p>
        </div>
        <button className="mt-4 md:mt-0 bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black hover:bg-indigo-50 transition-colors">
          View Insights
        </button>
      </div>
    </div>
  );
};

export default Brand;
