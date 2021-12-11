const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders', {
    order_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    order_status: {
      type: DataTypes.ENUM('PROCESSING','IN TRANSIT','DELIVERED','CANCELED'),
      allowNull: false,
      defaultValue: "PROCESSING"
    },
    placed_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    postal_code: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    province: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    payment_id: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    payment_method: {
      type: DataTypes.ENUM('CARD','CASH ON DELIVERY'),
      allowNull: false
    },
    items_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    shipping_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    tax_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    payment_status: {
      type: DataTypes.ENUM('NOT PAID','PAID'),
      allowNull: false
    },
    delivered_on: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'orders',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "order_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "fk_orders_users",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
