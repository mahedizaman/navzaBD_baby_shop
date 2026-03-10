const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Electronics",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    },
    {
      id: 2,
      name: "Fashion",
      img: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    },
    {
      id: 3,
      name: "Furniture",
      img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    },
    {
      id: 4,
      name: "Shoes",
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    },
    {
      id: 5,
      name: "Accessories",
      img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
    },
    {
      id: 6,
      name: "Gadgets",
      img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5",
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Shop By Categories
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="h-32 w-full object-cover"
              />

              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-700">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
