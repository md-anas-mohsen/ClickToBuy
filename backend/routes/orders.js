const router = require("express").Router();

const {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
  viewOrderAdmin,
} = require("../controllers/ordersController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

router.get("/orders", isAuthenticatedUser, myOrders);
router.post("/orders", isAuthenticatedUser, newOrder);
router.get("/orders/:id", isAuthenticatedUser, getSingleOrder);
router.get(
  "/admin/orders/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  viewOrderAdmin
);
router.get(
  "/admin/orders",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  allOrders
);
router.put(
  "/admin/orders/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  updateOrder
);
router.delete(
  "/admin/orders/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  deleteOrder
);

module.exports = router;
