const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('banner', {
    banner_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    image_id: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    banner_title: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    banner_description: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'products',
        key: 'product_id'
      }
    },
    category_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'category_id'
      }
    }
  }, {
    sequelize,
    tableName: 'banner',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "banner_id" },
        ]
      },
      {
        name: "banner_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "banner_id" },
        ]
      },
      {
        name: "fk_banner_product",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
      {
        name: "fk_banner_category",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
    ]
  });
};
