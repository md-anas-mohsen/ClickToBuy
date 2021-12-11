const {
  addBannerSlide,
  getBannerSlides,
  deleteBannerSlide,
  updateBannerSlide,
  getSingleBannerSlide,
} = require("../controllers/bannerController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = require("express").Router();

router.get("/banner", getBannerSlides);

router.get(
  "/admin/banner/slide/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  getSingleBannerSlide
);

router.post(
  "/admin/banner",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  addBannerSlide
);

router.put(
  "/admin/banner/slide/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  updateBannerSlide
);

router.delete(
  "/admin/banner/slide/:id",
  isAuthenticatedUser,
  authorizedRoles("ADMIN"),
  deleteBannerSlide
);

module.exports = router;
