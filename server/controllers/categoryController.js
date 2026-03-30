const Category = require("../models/categoryModel");

function getServerBaseUrl(req) {
  const envBase = process.env.SERVER_BASE_URL || process.env.BASE_URL;
  if (envBase && typeof envBase === "string") return envBase.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

function toAbsoluteImageUrl(rawImage, req) {
  if (!rawImage || typeof rawImage !== "string") return "";
  if (/^https?:\/\//i.test(rawImage)) return rawImage;

  const clean = rawImage.trim();
  if (!clean) return "";
  const base = getServerBaseUrl(req);
  const normalizedPath = clean.startsWith("/") ? clean : `/uploads/${clean}`;
  return `${base}${normalizedPath}`;
}

function normalizeCategory(categoryDoc, req) {
  const category = categoryDoc.toObject
    ? categoryDoc.toObject()
    : { ...categoryDoc };

  const sourceImage =
    category.image || category.imgUrl || category.imageUrl || category.photo || "";
  const absoluteImage = toAbsoluteImageUrl(sourceImage, req);

  return {
    ...category,
    image: absoluteImage,
    imgUrl: absoluteImage,
    imageUrl: absoluteImage,
  };
}

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories.map((item) => normalizeCategory(item, req)));
  } catch (error) {
    next(error);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    res.status(200).json(normalizeCategory(category, req));
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const body = req.body;
    const isBulk = Array.isArray(body);
    const items = isBulk ? body : [body];

    if (items.length === 0) {
      res.status(400);
      throw new Error("Request body must not be empty");
    }

    const normalized = items.map((item, index) => {
      if (!item || typeof item !== "object") {
        res.status(400);
        throw new Error(`Invalid category payload at index ${index}`);
      }

      const { name, description, image, imgUrl, imageUrl, categoryType } = item;
      if (!name) {
        res.status(400);
        throw new Error(`Missing "name" at index ${index}`);
      }
      if (!categoryType) {
        res.status(400);
        throw new Error(`Missing "categoryType" at index ${index}`);
      }

      return {
        name,
        description,
        image: image || imgUrl || imageUrl,
        categoryType,
      };
    });

    const names = normalized.map((c) => c.name);
    const existing = await Category.find({ name: { $in: names } }).select("name");
    if (existing.length > 0) {
      const existingNames = existing.map((c) => c.name);
      res.status(400);
      throw new Error(
        `Category with these names already exists: ${existingNames.join(", ")}`,
      );
    }

    if (isBulk) {
      const categories = await Category.insertMany(normalized);
      return res
        .status(201)
        .json(categories.map((item) => normalizeCategory(item, req)));
    }

    const createdCategory = await Category.create(normalized[0]);
    return res.status(201).json(normalizeCategory(createdCategory, req));
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = req.body.name || category.name;
      category.description = req.body.description || category.description;
      category.image =
        req.body.image || req.body.imgUrl || req.body.imageUrl || category.image;
      const updatedCategory = await category.save();
      res.status(200).json(normalizeCategory(updatedCategory, req));
    } else {
      res.status(404);
      throw new Error("Category not found");
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.deleteOne();
      res.status(200).json({ message: "Category removed" });
    } else {
      res.status(404);
      throw new Error("Category not found");
    }
  } catch (error) {
    next(error);
  }
};
