const Banner = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 items-center gap-10">
        {/* Left Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Discover Amazing <br /> Products For Your Life
          </h1>

          <p className="text-lg text-gray-200 mb-8">
            Find high quality products with the best price. Shop smart and
            upgrade your lifestyle with our latest collection.
          </p>

          <div className="flex gap-4">
            <button className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition">
              Shop Now
            </button>

            <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition">
              View Products
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f"
            alt="banner"
            className="rounded-xl shadow-2xl w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
