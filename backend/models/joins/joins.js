const {
  products: Product,
  product_images: ProductImage,
  product_reviews: ProductReview,
  product_categories: ProductCategory,
  categories: Category,
  users: User,
  category_discounts: CategoryDiscount,
} = require("../getModels");

exports.productJoins = [
  {
    model: ProductImage,
    attributes: ["image_id", "image_url"],
    as: "product_images",
  },
  {
    model: ProductReview,
    as: "product_reviews",
    include: [
      { model: User, attributes: ["full_name", "avatar_url"], as: "user" },
    ],
  },
  {
    model: ProductCategory,
    attributes: ["category_id"],
    as: "product_categories",
    include: [
      {
        model: Category,
        attributes: ["category_name", "discount"],
        as: "category",
      },
    ],
  },
];
