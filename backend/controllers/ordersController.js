const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {
  orders: Order,
  order_items: OrderItem,
  products: Product,
  product_images: ProductImage,
  users: User,
} = require("../models/getModels");
const sendEmail = require("../utils/sendEmail");

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    user_id: req.user.user_id,
    postal_code: shippingInfo.postalCode,
    address: shippingInfo.address,
    city: shippingInfo.city,
    province: shippingInfo.province,
    country: shippingInfo.country,
    phone_number: shippingInfo.phoneNo,
    payment_id: paymentInfo.id,
    payment_method: paymentInfo.paymentMethod,
    items_price: itemsPrice,
    shipping_price: shippingPrice,
    tax_price: taxPrice,
    total_price: totalPrice,
    payment_status: paymentInfo.id ? "PAID" : "NOT PAID",
  });

  let orderProducts = orderItems.map((item) => {
    return {
      order_id: order.order_id,
      product_id: item.productID,
      quantity: item.quantity,
      line_total: item.quantity * item.originalPrice,
      discounted_total:
        item.originalPrice !== item.price ? item.quantity * item.price : null,
    };
  });

  let message = `You have placed an order on ClickToBuy. Details are as follows.\n\norder_id: ${order.order_id}\n`;

  for (const [key, value] of Object.entries(order.dataValues)) {
    message += `${key}: ${value}\n`;
  }

  await sendEmail({
    email: req.user.email,
    subject: "Order Placed",
    message,
  });

  orderProducts = await OrderItem.bulkCreate(orderProducts);

  res.json({
    success: true,
    order,
    orderItems: orderProducts,
  });
});

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findOne({
    where: { order_id: req.params.id, user_id: req.user.user_id },
    include: [
      {
        model: OrderItem,
        as: "order_items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["name", "price"],
            include: {
              model: ProductImage,
              as: "product_images",
              attributes: ["image_url"],
            },
          },
        ],
      },
      { model: User, as: "user", attributes: ["full_name", "email"] },
    ],
  });

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.viewOrderAdmin = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findOne({
    where: { order_id: req.params.id },
    include: [
      {
        model: OrderItem,
        as: "order_items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["name", "price"],
            include: {
              model: ProductImage,
              as: "product_images",
              attributes: ["image_url"],
            },
          },
        ],
      },
      { model: User, as: "user", attributes: ["full_name", "email"] },
    ],
  });

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.findAll({
    where: { user_id: req.user.user_id },
    include: [
      {
        model: OrderItem,
        as: "order_items",
      },
      { model: User, as: "user", attributes: ["full_name"] },
    ],
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findOne({
    where: { order_id: req.params.id },
    include: [
      {
        model: OrderItem,
        as: "order_items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["name", "price"],
            include: {
              model: ProductImage,
              as: "product_images",
              attributes: ["image_url"],
            },
          },
        ],
      },
    ],
  });

  if (order.order_status === "DELIVERED") {
    return next(new ErrorHandler("Order has been already delivered", 400));
  }

  if (
    order.order_status === "PROCESSING" &&
    req.body.orderStatus !== "IN TRANSIT"
  ) {
    return next(new ErrorHandler("Order needs to be dispatched", 400));
  }

  if (
    order.order_status === "IN TRANSIT" &&
    req.body.orderStatus !== "DELIVERED"
  ) {
    return next(new ErrorHandler("Order is already in transit", 400));
  }

  if (req.body.orderStatus === "IN TRANSIT") {
    order.order_items.forEach(async (item) => {
      const product = await Product.findByPk(item.product_id);
      if (product.stock - item.quantity < 0)
        return next(new ErrorHandler(`${product.name} is out of stock`));
      await product.decrement({ stock: item.quantity });
      await product.save();
    });
  }

  if (req.body.orderStatus === "DELIVERED") {
    order.delivered_on = Date.now();
    order.payment_status = "PAID";
  }

  order.order_status = req.body.orderStatus;
  await order.save();

  const orderer = await User.findByPk(order.user_id);

  let message;

  if (order.order_status === "DELIVERED") {
    message = "Thankyou for your patience. ";
  }

  message = `Your order is now ${order.order_status.toLowerCase()}. Details are as follows.\n\norder_id: ${
    order.order_id
  }\n`;

  for (const [key, value] of Object.entries(order.dataValues)) {
    message += `${key}: ${value}\n`;
  }

  await sendEmail({
    email: orderer.email,
    subject: `Order ${order.order_status.toLowerCase()}`,
    message,
  });

  res.status(200).json({
    success: true,
    message: `Order is ${order.order_status.toLowerCase()}`,
  });
});

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByPk(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order does not exist", 404));
  }

  if (order.order_status !== "DELIVERED") {
    return next(new ErrorHandler("Only delivered orders may be deleted", 400));
  }

  await order.destroy();

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.findAll({
    include: [
      {
        model: OrderItem,
        as: "order_items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["name", "price"],
            include: {
              model: ProductImage,
              as: "product_images",
              attributes: ["image_url"],
            },
          },
        ],
      },
    ],
  });

  let totalAmount = 0;

  orders.forEach((order) => {
    if (order.payment_status === "PAID") {
      totalAmount += order.total_price;
    }
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});
