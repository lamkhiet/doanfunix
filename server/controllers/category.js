const fs = require("fs");
const path = require("path");
const Category = require("../models/category");

exports.getAll = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.status(200).json(categories);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.count) || 8;
  const search = req.query.search || "";

  const options = {
    page: page,
    limit: limit,
  };

  try {
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const result = await Category.paginate(query, options);

    res.json({
      categories: result.docs,
      totalPage: result.totalPages,
      totalDocs: result.totalDocs,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getDetail = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      res.status(404).json({ message: "Category Not Found!" });
    }

    return res.status(200).json(category);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postUpdate = async (req, res, next) => {
  const { categoryId, description } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category Not Found!" });
    }

    if (description !== undefined) category.description = description;

    await category.save();
    res.status(200).json({ message: "Update Category Successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// ==================ADMIN=========================

exports.postCreate = async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const category = new Category({
      name: name,
      description: description,
    });

    await category.save();

    res.status(200).json({ message: "Create Category Successfully!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    const category = await User.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category Not Found!" });
    }

    await Category.findByIdAndDelete(categoryId);
    res.status(200).json({ message: "Delete Successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
