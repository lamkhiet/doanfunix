const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const Category = require("../models/category");

exports.getAll = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json(products);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.count) || 8;
  const search = req.query.search || "";
  const category = req.query.category || "all";

  const options = {
    page: page,
    limit: limit,
  };

  try {
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category && category !== "all") {
      query.category = category;
    }

    const result = await Product.paginate(query, options);

    res.json({
      products: result.docs,
      totalPage: result.totalPages,
      totalDocs: result.totalDocs,
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.postSearch = async (req, res, next) => {
  const { searchTerm } = req.body;

  if (!searchTerm && searchTerm !== "") {
    return res.status(400).json({ message: "Search Term Error!" });
  }
  try {
    const products = await Product.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No Found Product!!" });
    }

    return res.status(200).json(products);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.getDetail = async (req, res, next) => {
  const prodId = req.params.prodId;

  try {
    const product = await Product.findById(prodId);

    if (!product) {
      res.status(404).json({ message: "Product Not Found!" });
    }

    return res.status(200).json(product);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postCreate = async (req, res, next) => {
  try {
    const { name, categoryName, description, price, stock, status } = req.body;

    let category = await Category.findOne({
      name: { $regex: new RegExp(`^${categoryName.trim()}$`, "i") },
    });
    if (!category) {
      category = await Category.create({ name: categoryName.trim() });
    }

    const images = req.files;

    if (!images || images.length !== 5) {
      return res.status(400).json({
        message: "5 Images!!!",
      });
    }

    const imgNames = images.map((file) => file.filename);

    const newProduct = new Product({
      name: name,
      category: category._id,
      description: description,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      status: status,
      images: imgNames,
    });

    const result = await newProduct.save();

    return res.status(201).json({
      message: "Create Product Successfully!",
    });
  } catch (err) {
    console.error("Server Error:", err);

    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putUpdate = async (req, res, next) => {
  const {
    productId,
    name,
    price,
    description,
    category,
    stock,
    remainOldImages,
  } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found!" });
    }

    let finalOldImages = [];
    if (remainOldImages) {
      finalOldImages = JSON.parse(remainOldImages);
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach((fileName) => {
        if (!finalOldImages.includes(fileName)) {
          const filePath = path.join(__dirname, "..", "images", fileName);
          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Delete Image ${fileName} Error:`, err);
              }
            });
          }
        }
      });
    }

    let newImgNames = [];
    if (req.files && req.files.length > 0) {
      newImgNames = req.files.map((file) => file.filename);
    }

    const updatedImages = [...finalOldImages, ...newImgNames];

    if (updatedImages.length !== 5) {
      return res.status(400).json({
        message: "5 Images!!!",
      });
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = Number(price);
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);

    product.images = updatedImages;

    await product.save();
    res.status(200).json({ message: "Update Product Successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

// ==================ADMIN=========================

exports.putAdminUpdate = async (req, res, next) => {
  const {
    productId,
    name,
    price,
    description,
    category,
    stock,
    status,
    remainOldImages,
  } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found!" });
    }

    let finalOldImages = [];
    if (remainOldImages) {
      finalOldImages = JSON.parse(remainOldImages);
    }

    if (product.images && product.images.length > 0) {
      product.images.forEach((fileName) => {
        if (!finalOldImages.includes(fileName)) {
          const filePath = path.join(__dirname, "..", "images", fileName);
          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Delete Image ${fileName} Error:`, err);
              }
            });
          }
        }
      });
    }

    let newImgNames = [];
    if (req.files && req.files.length > 0) {
      newImgNames = req.files.map((file) => file.filename);
    }

    const updatedImages = [...finalOldImages, ...newImgNames];

    if (updatedImages.length !== 5) {
      return res.status(400).json({
        message: "5 Images!!!",
      });
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = Number(price);
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);
    if (status !== undefined) product.status = status;

    product.images = updatedImages;

    await product.save();
    res.status(200).json({ message: "Update Product Successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const prodId = req.params.prodId;

  try {
    const product = await Product.findById(prodId);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found!" });
    }
    if (product.images && product.images.length > 0) {
      product.images.forEach((fileName) => {
        const filePath = path.join(__dirname, "..", "images", fileName);

        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Delete Image ${fileName} Error:`, err);
            }
          });
        }
      });
    }

    await Product.findByIdAndDelete(prodId);
    res.status(200).json({ message: "Delete Product Successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
