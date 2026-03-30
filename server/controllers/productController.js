const Product = require("../models/productModel.js");
const cloudinary = require("../config/cloudinary.js");

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "navzabd/products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
}

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

// @desc    Create a product (JSON single/bulk, or multipart/form-data with field "image")
const createProduct = async (req, res) => {
  try {
    let items;

    if (req.file) {
      const category = req.body.categoryId || req.body.category;
      const brand = req.body.brandId || req.body.brand;
      if (!category || !brand) {
        return res.status(400).json({
          success: false,
          message: "categoryId and brandId are required",
        });
      }
      if (
        !req.body.name ||
        !req.body.description ||
        req.body.price === undefined ||
        req.body.price === ""
      ) {
        return res.status(400).json({
          success: false,
          message: "name, description, and price are required",
        });
      }

      const uploaded = await uploadBufferToCloudinary(req.file.buffer);
      items = [
        {
          name: String(req.body.name).trim(),
          description: String(req.body.description),
          price: Number(req.body.price),
          discountPercentage: Number(req.body.discountPercentage ?? 0),
          stock: Number(req.body.stock ?? 0),
          category,
          brand,
          image: uploaded.secure_url,
        },
      ];
    } else {
      const body = req.body;
      const isBulk = Array.isArray(body);
      const parsed = isBulk ? body : [body];
      items = parsed.map((item) => ({
        ...item,
        category: item.categoryId || item.category,
        brand: item.brandId || item.brand,
      }));
    }

    if (items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Request body is empty" });
    }

    const names = items.map((item) => item.name);
    const existingProducts = await Product.find({ name: { $in: names } });
    if (existingProducts.length > 0) {
      const existingNames = existingProducts.map((p) => p.name);
      return res.status(400).json({
        success: false,
        message: `Products already exist: ${existingNames.join(", ")}`,
      });
    }

    const productsToSave = await Promise.all(
      items.map(async (item) => {
        let finalImageUrl = item.image;

        if (
          typeof item.image === "string" &&
          item.image.length > 0 &&
          !item.image.startsWith("http")
        ) {
          const result = await cloudinary.uploader.upload(item.image, {
            folder: "navzabd/products",
          });
          finalImageUrl = result.secure_url;
        }

        return {
          name: item.name,
          description: item.description,
          price: item.price,
          discountPercentage: item.discountPercentage || 0,
          stock: item.stock || 0,
          category: item.category,
          brand: item.brand,
          image: finalImageUrl,
        };
      }),
    );

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

// @desc    Update a product (JSON or multipart with optional "image" file)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const body = req.body || {};
    const name = body.name;
    const description = body.description;
    const price = body.price;
    const category = body.categoryId || body.category;
    const brand = body.brandId || body.brand;
    const image = body.image;
    const discountPercentage = body.discountPercentage;
    const stock = body.stock;

    if (name && name !== product.name) {
      const exists = await Product.findOne({ name });
      if (exists)
        return res.status(400).json({ message: "Product name already exists" });
      product.name = name;
    }

    if (description !== undefined && description !== "")
      product.description = description;
    if (price !== undefined && price !== "")
      product.price = Number(price);
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (discountPercentage !== undefined && discountPercentage !== "")
      product.discountPercentage = Number(discountPercentage);
    if (stock !== undefined && stock !== "") product.stock = Number(stock);

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer);
      product.image = uploaded.secure_url;
    } else if (image && image !== product.image) {
      if (typeof image === "string" && image.startsWith("http")) {
        product.image = image;
      } else if (typeof image === "string" && image.length > 0) {
        const result = await cloudinary.uploader.upload(image, {
          folder: "navzabd/products",
        });
        product.image = result.secure_url;
      }
    }

    const updatedProduct = await product.save();
    const populated = await Product.findById(updatedProduct._id)
      .populate("category", "name")
      .populate("brand", "name");
    res.json(populated);
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
