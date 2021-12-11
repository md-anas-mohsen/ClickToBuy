const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { banner: Banner, categories: Category } = require("../models/getModels");
const ErrorHandler = require("../utils/errorHandler");

exports.getBannerSlides = catchAsyncErrors(async (req, res, next) => {
  const banner = await Banner.findAll({
    include: [
      { model: Category, attributes: ["category_name"], as: "category" },
    ],
  });

  res.status(200).json({
    success: true,
    banner,
  });
});

exports.getSingleBannerSlide = catchAsyncErrors(async (req, res, next) => {
  const slide = await Banner.findOne({
    where: { banner_id: req.params.id },
    include: [
      { model: Category, attributes: ["category_name"], as: "category" },
    ],
  });

  res.status(200).json({
    success: true,
    slide,
  });
});

exports.addBannerSlide = catchAsyncErrors(async (req, res, next) => {
  const { image, bannerTitle, bannerDescription, productId, categoryId } =
    req.body;

  const result = await cloudinary.v2.uploader.upload(image, {
    folder: "banner",
  });

  let banner = {
    banner_title: bannerTitle,
    banner_description: bannerDescription,
    image_url: result.secure_url,
    image_id: result.public_id,
  };

  if (productId) {
    banner.product_id = productId;
  }

  if (categoryId) {
    banner.category_id = categoryId;
  }

  banner = await Banner.create(banner);

  res.status(200).json({
    success: true,
    banner,
  });
});

exports.updateBannerSlide = catchAsyncErrors(async (req, res, next) => {
  const { image, bannerTitle, bannerDescription, productId, categoryId } =
    req.body;

  const banner = await Banner.findByPk(req.params.id);

  if (image !== banner.image_url) {
    await cloudinary.v2.uploader.destroy(banner.image_id);
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: "banner",
    });
    banner.image_id = result.public_id;
    banner.image_url = result.secure_url;
  }

  banner.banner_title = bannerTitle;
  banner.banner_description = bannerDescription;

  if (productId) {
    banner.product_id = productId;
    banner.category_id = null;
  }

  if (categoryId) {
    banner.category_id = categoryId;
    banner.product_id = null;
  }

  await banner.save();

  res.status(200).json({
    success: true,
    message: "Banner slide updated",
  });
});

exports.deleteBannerSlide = catchAsyncErrors(async (req, res, next) => {
  const banner = await Banner.findByPk(req.params.id);

  if (!banner) {
    return next(new ErrorHandler("Invalid banner slide", 404));
  }

  await banner.destroy();

  res.status(200).json({
    success: true,
    message: "Banner slide successfully deleted",
  });
});
