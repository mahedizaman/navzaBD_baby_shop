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
    const { name, title, image } = req.body;
    const brand = new Brand({ name, title, image });
    const createdBrand = await brand.save();
    res.status(201).json(createdBrand);
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
