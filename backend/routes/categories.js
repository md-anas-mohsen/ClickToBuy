const {
  getCategories,
  createCategory,
  assignToCategory,
  removeFromCategory,
  deleteCategory,
  updateCategory,
  addCategoryDiscount,
  deleteCategoryDiscount,
  getAllCategoryDiscounts,
  getCategoriesAdminView,
  getAllProductsInCategory,
} = require("../controllers/categoriesController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = require("express").Router();

router.get("/categories", getCategories);
router.get("/discount/categories", getAllCategoryDiscounts);
router.get("/admin/categories", getCategoriesAdminView);
router.get("/admin/categories/:id", getAllProductsInCategory);

router.post(
  "/admin/categories",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  createCategory
);
router.put(
  "/admin/categories/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  updateCategory
);
router.post(
  "/admin/discount/categories/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  addCategoryDiscount
);

// router.put("/categories/:id", updateCategory);

router.delete(
  "/admin/categories/:category_id/:product_id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  removeFromCategory
);
router.delete(
  "/admin/categories/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  deleteCategory
);
router.delete(
  "/admin/discount/categories/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  deleteCategoryDiscount
);

module.exports = router;
