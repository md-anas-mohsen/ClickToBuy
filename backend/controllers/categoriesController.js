const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {
  products: Product,
  categories: Category,
  product_categories: ProductCategory,
  category_discounts: CategoryDiscount,
  users: User,
} = require("../models/getModels");
const { productJoins } = require("../models/joins/joins");

const Op = require("sequelize").Op;

const APIQuery = require("../utils/APIQuery");
const ErrorHandler = require("../utils/errorHandler");

exports.getCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.findAll();

  res.status(200).json({
    success: true,
    categories,
  });
});

exports.getCategoriesAdminView = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.findAll({
    include: [{ model: User, as: "user", attributes: ["full_name", "email"] }],
  });

  res.status(200).json({
    success: true,
    categories,
  });
});

exports.createCategory = catchAsyncErrors(async (req, res, next) => {
  const { category_name } = req.body;
  await Category.create({ category_name, user_id: req.user.user_id });

  res.status(200).json({
    success: true,
    message: "Category Created Successfully",
  });
});

exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  const { category_name, product_ids, discount } = req.body;

  console.log(`category: ${req.params.id}`);

  const category = await Category.findOne({
    where: { category_id: req.params.id },
  });
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  const categoryProducts = await Product.findAll({
    where: { product_id: { [Op.in]: product_ids } },
    include: productJoins,
  });

  categoryProducts.forEach((product) => {
    const categories = product.product_categories;
    categories.forEach((c) => {
      if (
        c.category_id !== category.category_id &&
        c.category.discount > 0 &&
        (category.discount > 0 || discount > 0)
      ) {
        return next(
          new ErrorHandler(
            `'${product.name}' already has a discount for category '${c.category.category_name}'`,
            400
          )
        );
      }
    });
  });

  await ProductCategory.destroy({ where: { category_id: req.params.id } });

  product_ids.forEach(async (product_id) => {
    await ProductCategory.create({ category_id: req.params.id, product_id });
  });

  category.category_name = category_name;
  category.discount = discount;
  category.user_id = req.user.user_id;
  await category.save();

  res.status(200).json({
    success: true,
    message: "Category Updated Successfully",
  });
});

//OBSOLETE
// exports.assignToCategory = catchAsyncErrors(async (req, res, next) => {
//   const { product_ids } = req.body;
//   const category_id = req.params.id;

//   await ProductCategory.destroy({ where: { category_id } });

//   product_ids.forEach((product_id) => {
//     await ProductCategory.create({ category_id, product_id });
//   });

//   res.status(200).json({
//     success: true,
//     message: "Products assigned to category",
//   });
// });

exports.removeFromCategory = catchAsyncErrors(async (req, res, next) => {
  const { category_id, product_id } = req.params;
  await ProductCategory.destroy({
    where: { category_id: category_id, product_id: product_id },
  });

  res.status(200).json({
    success: true,
  });
});

exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findOne({
    where: { category_id: req.params.id },
  });
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  await Category.destroy({ where: { category_id: req.params.id } });

  res.status(200).json({
    success: true,
    message: "Category Deleted Successfully",
  });
});

exports.getAllCategoryDiscounts = catchAsyncErrors(async (req, res, next) => {
  const categoryDiscounts = await CategoryDiscount.findAll({
    include: [
      { model: Category, attributes: ["category_name"], as: "category" },
    ],
  });

  res.status(200).json({
    success: true,
    categoryDiscounts,
  });
});

exports.getAllProductsInCategory = catchAsyncErrors(async (req, res, next) => {
  const productCount = await Product.count();
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  let products = new APIQuery(
    Product,
    { category: category.category_name },
    productJoins,
    productCount
  ).query();

  products = (await products).queryResult;

  res.status(200).json({
    success: true,
    category,
    products,
  });
});

exports.addCategoryDiscount = catchAsyncErrors(async (req, res, next) => {
  const { discount } = req.body;
  const allProducts = await Product.findAll();
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return next(new ErrorHandler("Category does not exist", 404));
  }
  const categoryProductsQuery = new APIQuery(
    Product,
    { category: category.category_name },
    productJoins,
    allProducts.length
  ).query();
  const categoryProducts = (await categoryProductsQuery).queryResult;

  categoryProducts.forEach((product) => {
    const categories = product.product_categories;
    categories.forEach((c) => {
      if (c.category.category_discount) {
        return next(
          new ErrorHandler(
            `'${product.name}' already has a discount for category '${c.category.category_name}'`,
            400
          )
        );
      }
    });
  });

  const categoryDiscount = await CategoryDiscount.create({
    category_id: req.params.id,
    discount,
  });

  res.status(200).json({
    success: true,
    categoryDiscount,
  });
});

exports.deleteCategoryDiscount = catchAsyncErrors(async (req, res, next) => {
  const categoryDiscount = await CategoryDiscount.findByPk(req.params.id);

  if (!categoryDiscount) {
    return next(new ErrorHandler("Category Doesnot have a discount"));
  }

  await categoryDiscount.destroy();

  res.status(200).json({
    success: true,
  });
});
