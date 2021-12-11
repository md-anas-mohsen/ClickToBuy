const {
  getAllProducts,
  getProducts,
  createProduct,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  createOrUpdateReview,
  getRelatedProducts,
  deleteReview,
} = require("../controllers/productsController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = require("express").Router();

router.get(
  "/admin/all-products",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  getAllProducts
);
router.get("/products", getProducts);
router.get("/products/:id", getSingleProduct);
router.get("/related-products", getRelatedProducts);

router.post(
  "/admin/products",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  createProduct
);

router.post("/products/:id", isAuthenticatedUser, createOrUpdateReview);

router.put(
  "/admin/products/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  updateProduct
);

router.delete("/admin/reviews", deleteReview);

router.delete(
  "/admin/products/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  deleteProduct
);

module.exports = router;
