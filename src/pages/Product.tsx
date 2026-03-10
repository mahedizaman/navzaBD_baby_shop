const Product = () => {
  const products = [
    { id: 1, name: "Laptop", price: 75000, category: "Electronics" },
    { id: 2, name: "Smartphone", price: 25000, category: "Electronics" },
    { id: 3, name: "Headphone", price: 3000, category: "Accessories" },
    { id: 4, name: "Keyboard", price: 1500, category: "Accessories" },
    { id: 5, name: "Mouse", price: 800, category: "Accessories" },
    { id: 6, name: "Monitor", price: 18000, category: "Electronics" },
    { id: 7, name: "Chair", price: 7000, category: "Furniture" },
    { id: 8, name: "Table", price: 12000, category: "Furniture" },
    { id: 9, name: "USB Cable", price: 300, category: "Accessories" },
    { id: 10, name: "Power Bank", price: 2000, category: "Electronics" },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Product List</h2>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Product Name</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Price</th>
            </tr>
          </thead>

          <tbody className="text-gray-600">
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-6 font-medium">{product.id}</td>
                <td className="py-4 px-6">{product.name}</td>
                <td className="py-4 px-6">{product.category}</td>
                <td className="py-4 px-6">৳ {product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Product;
