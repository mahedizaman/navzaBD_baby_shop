const Category = require("../models/categoryModel");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
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
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const category = new Category({ name, description, image });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
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
      category.image = req.body.image || category.image;
      const updatedCategory = await category.save();
      res.status(200).json(updatedCategory);
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
