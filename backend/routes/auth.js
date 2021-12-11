const router = require("express").Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  getUserNamePic,
  getUserDetails,
  updateUser,
  deleteUser,
  allUsers,
} = require("../controllers/authController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/password/reset", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update", isAuthenticatedUser, updatePassword);

router.delete("/logout", logoutUser);

router.get("/me", isAuthenticatedUser, getUserProfile);
router.put("/me/update", isAuthenticatedUser, updateProfile);

router.get("/frontend/user/:id", getUserNamePic);

router.get(
  "/admin/users",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  allUsers
);
router.get(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  getUserDetails
);
router.put(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  updateUser
);
router.delete(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  deleteUser
);

module.exports = router;
