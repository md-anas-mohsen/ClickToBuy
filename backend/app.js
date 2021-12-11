const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();

const products = require("./routes/products");
const categories = require("./routes/categories");
const auth = require("./routes/auth");
const payments = require("./routes/payments");
const orders = require("./routes/orders");
const banner = require("./routes/banner");

const errorMiddleware = require("./middleware/errors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

app.use("/api", products);
app.use("/api", categories);
app.use("/api", auth);
app.use("/api", orders);
app.use("/api", payments);
app.use("/api", banner);

app.use(errorMiddleware);

module.exports = app;
