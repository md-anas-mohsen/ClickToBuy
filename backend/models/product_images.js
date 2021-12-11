const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_images', {
    image_no: {
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
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'products',
        key: 'product_id'
      }
    }
  }, {
    sequelize,
    tableName: 'product_images',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "image_no" },
        ]
      },
      {
        name: "image_no",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "image_no" },
        ]
      },
      {
        name: "fk_productImages_products",
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
    ]
  });
};
