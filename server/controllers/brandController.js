const Brand = require("../models/brandModel");
const cloudinary = require("../config/cloudinary.js");

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "navzabd/brands" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
}

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
    // Multipart (FormData) with a single image file
    if (req.file) {
      const { name, title, description } = req.body || {};
      if (!name) {
        res.status(400);
        throw new Error('Missing "name"');
      }
      const uploaded = await uploadBufferToCloudinary(req.file.buffer);
      const payload = {
        name,
        description: description ?? title ?? "",
        image: uploaded.secure_url,
      };

      const existing = await Brand.findOne({ name: payload.name }).select("name");
      if (existing) {
        res.status(400);
        throw new Error(`Brand with this name already exists: ${existing.name}`);
      }

      const createdBrand = await Brand.create(payload);
      return res.status(201).json(createdBrand);
    }

    // JSON single/bulk payload
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
      if (req.body?.name) brand.name = req.body.name;
      if (req.body?.description) brand.description = req.body.description;

      if (req.file) {
        const uploadedImageUrl = (
          await uploadBufferToCloudinary(req.file.buffer)
        ).secure_url;
        brand.image = uploadedImageUrl;
      } else if (req.body?.image !== undefined) {
        brand.image = req.body.image || brand.image;
      }

      // Backward compatibility: accept `title` as description.
      if (req.body?.title && !req.body?.description) {
        brand.description = req.body.title;
      }

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
