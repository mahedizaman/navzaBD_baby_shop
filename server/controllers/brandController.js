const Brand = require("../models/brandModel");

exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({});
    res.status(200).json(brands);
  } catch (error) {
    next(error);
  }
};

exports.getBrandById = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      res.status(404);
      throw new Error("Brand not found");
    }
    res.status(200).json(brand);
  } catch (error) {
    next(error);
  }
};

exports.createBrand = async (req, res, next) => {
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
        throw new Error(`Invalid brand payload at index ${index}`);
      }

      const { name, title, description, image } = item;

      const finalDescription = description ?? title ?? "";
      if (!name) {
        res.status(400);
        throw new Error(`Missing "name" at index ${index}`);
      }

      return {
        name,
        description: finalDescription,
        image: image ?? "",
      };
    });

    const names = normalized.map((b) => b.name);
    const existing = await Brand.find({ name: { $in: names } }).select("name");
    if (existing.length > 0) {
      const existingNames = existing.map((b) => b.name);
      res.status(400);
      throw new Error(`Brand with these names already exists: ${existingNames.join(", ")}`);
    }

    if (isBulk) {
      const brands = await Brand.insertMany(normalized);
      return res.status(201).json(brands);
    }

    const createdBrand = await Brand.create(normalized[0]);
    return res.status(201).json(createdBrand);
  } catch (error) {
    next(error);
  }
};

exports.updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (brand) {
      brand.name = req.body.name || brand.name;
      brand.title = req.body.title || brand.title;
      brand.image = req.body.image || brand.image;
      const updatedBrand = await brand.save();
      res.status(200).json(updatedBrand);
    } else {
      res.status(404);
      throw new Error("Brand not found");
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (brand) {
      await brand.deleteOne();
      res.status(200).json({ message: "Brand removed" });
    } else {
      res.status(404);
      throw new Error("Brand not found");
    }
  } catch (error) {
    next(error);
  }
};
