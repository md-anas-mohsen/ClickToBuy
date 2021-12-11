const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

const {
  products: Product,
  product_images: ProductImage,
  product_reviews: ProductReview,
} = require("../models/getModels");
const { productJoins } = require("../models/joins/joins");

const APIQuery = require("../utils/APIQuery");

exports.getProducts = async (req, res, next) => {
  const resultsPerPage = 8;
  const page = req.query.page ? req.query.page : 1;
  let apiQuery = new APIQuery(
    Product,
    req.query,
    productJoins,
    resultsPerPage
  ).query();
  const products = (await apiQuery).queryResult;
  const productCount = (await apiQuery).resultCount;

  res.status(200).json({
    success: true,
    productCount: productCount,
    resPerPage: resultsPerPage,
    page: Number(page),
    products,
  });
};

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOne({
    where: { product_id: id },
    include: productJoins,
  });

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.getRelatedProducts = catchAsyncErrors(async (req, res, next) => {
  const { productId, category } = req.query;

  let relatedProducts = new APIQuery(
    Product,
    { category },
    productJoins,
    100
  ).query();

  relatedProducts = (await relatedProducts).queryResult;

  relatedProducts = relatedProducts
    .filter((product) => {
      return product.product_id !== Number(productId);
    })
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  res.status(200).json({
    success: true,
    relatedProducts,
  });
});

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.findAll({
    include: productJoins,
  });
  res.status(200).json({
    success: true,
    products,
  });
});

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, stock, price } = req.body;
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let product = await Product.create({
    name,
    description,
    stock,
    price,
    user_id: req.user.user_id,
  });

  let imageLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imageLinks.push({
      image_id: result.public_id,
      image_url: result.secure_url,
      product_id: product.product_id,
    });
  }

  await ProductImage.bulkCreate(imageLinks);
  product = await Product.findOne({
    where: {
      product_id: product.product_id,
    },
    include: productJoins,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, stock } = req.body;
  let imageLinks = [];
  let product = await Product.findOne({
    where: { product_id: req.params.id },
    include: productJoins,
  });
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    for (let i = 0; i < product.product_images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.product_images[i].public_id);
    }
    await ProductImage.destroy({ where: { product_id: req.params.id } });

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imageLinks.push({
        image_id: result.public_id,
        image_url: result.secure_url,
        product_id: product.product_id,
      });
    }
    await ProductImage.bulkCreate(image);
  }
  // req.body.user = req.user._id;

  await Product.update(
    { name, description, price, stock, user_id: req.user.user_id },
    { where: { product_id: product.product_id } }
  );
  product = await Product.findOne({
    where: { product_id: req.params.id },
    include: productJoins,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findOne({
    where: { product_id: id },
    include: productJoins,
  });
  const productImages = product.product_images;

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  productImages.forEach(async (image) => {
    await cloudinary.v2.uploader.destroy(image.image_id);
  });

  await Product.destroy({ where: { product_id: id } });

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

exports.createOrUpdateReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;

  let review = await ProductReview.findOne({
    where: { user_id: req.user.user_id, product_id: req.params.id },
  });

  if (!review) {
    review = await ProductReview.create({
      product_id: req.params.id,
      user_id: req.user.user_id,
      comment,
      rating,
    });
  } else {
    review.comment = comment;
    review.rating = rating;
    await review.save();
  }

  res.status(200).json({
    success: true,
    review,
  });
});

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const review = await ProductReview.findOne({
    where: { user_id: req.query.userId, product_id: req.query.productId },
  });

  if (!review) {
    return next(new ErrorHandler("Review does not exist", 404));
  }

  await review.destroy();

  res.status(200).json({
    success: true,
  });
});
