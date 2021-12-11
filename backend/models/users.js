const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    "users",
    {
      user_id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      role: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "USER",
      },
      full_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        select: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.fn("current_timestamp"),
      },
      avatar_id: {
        type: DataTypes.STRING(40),
        allowNull: true,
        defaultValue: "ID",
      },
      avatar_url: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: "NO AVATAR",
      },
      reset_password_token: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      reset_password_expire: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
        {
          name: "user_id",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
        {
          name: "email",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
      ],
      defaultScope: {
        attributes: {
          exclude: ["password"],
        },
      },
      hooks: {
        beforeCreate: async (user, options) => {
          const hashedPassword = await bcrypt.hash(user.password, 12);
          user.password = hashedPassword;
          if (user.role.toUpperCase() === "ADMIN") {
            user.role = "ADMIN";
          } else {
            user.role = "USER";
          }
        },
      },
    }
  );

  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  User.prototype.getJwtToken = function () {
    return jwt.sign({ id: this.user_id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });
  };

  User.prototype.getResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.reset_password_token = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.reset_password_expire = Date.now() + 20 * 60 * 1000;
    await this.save();
    return resetToken;
  };

  return User;
};
