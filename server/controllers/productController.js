const Product = require("../models/productModel.js");
const cloudinary = require("../config/cloudinary.js");

// @desc    Get all products with pagination, sorting, and filtering
const getProducts = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortOrder = "asc",
    category,
    brand,
    priceMin,
    priceMax,
    search,
  } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  if (pageNumber < 1 || limitNumber < 1) {
    return res
      .status(400)
      .json({ message: "Page and limit must be positive integers" });
  }

  const query = {};
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = Number(priceMin);
    if (priceMax) {
      query.price.$lte =
        Number(priceMax) === Infinity
          ? Number.MAX_SAFE_INTEGER
          : Number(priceMax);
    }
  }

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const skip = (pageNumber - 1) * limitNumber;
  const sortValue = sortOrder === "asc" ? 1 : -1;

  try {
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name")
        .populate("brand", "name")
        .skip(skip)
        .limit(limitNumber)
        .sort({ createdAt: sortValue }),
      Product.countDocuments(query),
    ]);

    res.json({ products, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("brand", "name");

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Single or Bulk)
const createProduct = async (req, res) => {
  try {
    const body = req.body;
    const isBulk = Array.isArray(body);
    const items = isBulk ? body : [body];

    if (items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Request body is empty" });
    }

    // ১. ডুপ্লিকেট চেক (একই নামের প্রোডাক্ট আছে কি না)
    const names = items.map((item) => item.name);
    const existingProducts = await Product.find({ name: { $in: names } });
    if (existingProducts.length > 0) {
      const existingNames = existingProducts.map((p) => p.name);
      return res.status(400).json({
        success: false,
        message: `Products already exist: ${existingNames.join(", ")}`,
      });
    }

    // ২. ইমেজ প্রসেসিং এবং ডাটা প্রেপারেশন
    const productsToSave = await Promise.all(
      items.map(async (item) => {
        let finalImageUrl = item.image;

        // যদি ইমেজটি URL না হয়, তবেই ক্লাউডিনারিতে আপলোড হবে
        if (typeof item.image === "string" && !item.image.startsWith("http")) {
          const result = await cloudinary.uploader.upload(item.image, {
            folder: "navzabd/products",
          });
          finalImageUrl = result.secure_url;
        }

        return {
          ...item,
          image: finalImageUrl,
          discountPercentage: item.discountPercentage || 0,
          stock: item.stock || 0,
        };
      }),
    );

    // ৩. ডাটাবেজে সেভ করা
    const createdProducts = await Product.insertMany(productsToSave);

    res.status(201).json({
      success: true,
      count: createdProducts.length,
      data: createdProducts,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      image,
      discountPercentage,
      stock,
    } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // নাম পরিবর্তন করলে ডুপ্লিকেট চেক
    if (name && name !== product.name) {
      const exists = await Product.findOne({ name });
      if (exists)
        return res.status(400).json({ message: "Product name already exists" });
      product.name = name;
    }

    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (discountPercentage !== undefined)
      product.discountPercentage = discountPercentage;
    if (stock !== undefined) product.stock = stock;

    // ইমেজ আপডেট লজিক
    if (image && image !== product.image) {
      if (typeof image === "string" && image.startsWith("http")) {
        product.image = image;
      } else {
        const result = await cloudinary.uploader.upload(image, {
          folder: "navzabd/products",
        });
        product.image = result.secure_url;
      }
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Rate a product
const rateProduct = async (req, res) => {
  try {
    const { rating } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyRated = product.ratings.find(
      (r) => r.userId.toString() === req.user._id.toString(),
    );

    if (alreadyRated) {
      alreadyRated.rating = rating;
    } else {
      product.ratings.push({ userId: req.user._id, rating });
    }

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  rateProduct,
  deleteProduct,
};
