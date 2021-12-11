const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const sequelize = require("sequelize");
const Op = sequelize.Op;
const { users: User } = require("../models/getModels");

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  let result;
  if (req.body.avatar) {
    result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 480,
      crop: "scale",
    });
  }
  const { full_name, email, password } = req.body;
  const user = await User.create({
    full_name,
    email,
    password,
    avatar_id: result ? result.public_id : "ID",
    avatar_url: result ? result.secure_url : "NO AVATAR",
  });

  sendToken(user, 200, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password"), 400);
  }
  const user = await User.findOne({
    where: { email },
    attributes: { include: ["password"] },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const match = await user.comparePassword(password);
  if (!match) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ where: { user_id: req.user.user_id } });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return next(new ErrorHandler("This mail is not registered", 404));
  }

  const resetToken = await user.getResetPasswordToken();
  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  // const resetUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/password/reset/${resetToken}`;

  const message = `Here is your password reset token: \n\n${resetUrl}\n\n`;

  try {
    await sendEmail({
      email: user.email,
      subject: "ClickToBuy password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
      resetToken,
    });
  } catch (error) {
    user.reset_password_token = null;
    user.reset_password_expire = null;

    await user.save();
  }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    where: {
      reset_password_token: resetPasswordToken,
      reset_password_expire: { [Op.gt]: new Date() },
    },
    attributes: { include: ["password"] },
  });
  if (!user) {
    return next(
      new ErrorHandler("Password reset token is invalid or has expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = await bcrypt.hash(req.body.password, 12);
  user.reset_password_token = null;
  user.reset_password_expire = null;
  console.log(user);
  await user.save();

  sendToken(user, 200, res);
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({
    where: { user_id: req.user.user_id },
    attributes: { include: ["password"] },
  });

  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old Password is incorrect"));
  }

  if (req.body.password === req.body.confirmPassword) {
    user.password = await bcrypt.hash(req.body.password, 12);
    await user.save();
    return sendToken(user, 200, res);
  } else {
    return next(new ErrorHandler("Passwords Do not Match", 400));
  }
});

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    full_name: req.body.full_name,
    email: req.body.email,
  };

  let user = await User.findOne({ where: { user_id: req.user.user_id } });

  if (req.body.avatar !== user.avatar_url) {
    const image_id = user.avatar_id;
    const res = await cloudinary.v2.uploader.destroy(image_id);

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 480,
      crop: "scale",
    });

    newUserData.avatar_id = result.public_id;
    newUserData.avatar_url = result.secure_url;
  }

  user = await User.update(newUserData, {
    where: { user_id: req.user.user_id },
  });

  res.status(200).json({
    success: true,
  });
});

exports.getUserNamePic = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ where: { user_id: req.params.id } });

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user: {
      name: user.full_name,
      avatar: user.avatar_url,
    },
  });
});

exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.findAll();

  res.status(200).json({
    success: true,
    users,
  });
});

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    full_name: req.body.full_name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.update(newUserData, {
    where: { user_id: req.params.id },
  });

  res.status(200).json({
    success: true,
  });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }
  await user.destroy();
  res.status(200).json({
    success: true,
  });
});
