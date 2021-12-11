import {
  Button,
  Card,
  Grid,
  IconButton,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
  StepConnector,
  Typography,
  withStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@material-ui/core";
import React, { useState, useEffect, useContext, Fragment } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import InfoIcon from "@material-ui/icons/Info";
import ListIcon from "@material-ui/icons/List";
import SettingsIcon from "@material-ui/icons/Settings";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import "./styles/OrderDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../../../context/AppContext";
import { clearErrors, getOrderDetails } from "../../../actions/orderActions";
import { Skeleton } from "@material-ui/lab";
import { Status } from "../OrderList/OrderList";
import PageError from "../../Misc/PageError/PageError";
import MetaData from "../../Layout/MetaData/MetaData";
import { CREATE_ORDER_RESET } from "../../../constants/orderConstants";

const steps = ["Processing", "In transit", "Delivered"];

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  },
});

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <LocalShippingIcon />,
    3: <CheckCircleIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

const OrderStatus = ({ orderStatus, steps }) => {
  return (
    <Grid
      container
      direction="column"
      align="center"
      className="orderDetails__main__status"
    >
      <Grid item xs={12}>
        <Stepper
          alternativeLabel
          activeStep={
            orderStatus === "PROCESSING"
              ? 0
              : orderStatus === "IN TRANSIT"
              ? 1
              : orderStatus === "DELIVERED" && 2
          }
          connector={<ColorlibConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
      {/* <Grid container justify="center" style={{margin: "0 20px"}}>
                                  <Grid item xs={6}><Status status={orderStatus} size="large" /></Grid>
                                </Grid> */}

      <Grid item xs={12}>
        {orderStatus === "PROCESSING" && (
          <Fragment>
            <Typography variant="subtitle1">
              Wait a bit while we process your order.
            </Typography>
            <br />
            <img
              alt="processing"
              src="/images/order_processing.svg"
              width="80%"
              height="300px"
            />
          </Fragment>
        )}
        {orderStatus === "IN TRANSIT" && (
          <Fragment>
            <Typography>
              Sit tight! Your order is packed and on the way.
            </Typography>
            <br />
            <img
              alt="in transit"
              src="/images/order_in_transit.svg"
              width="80%"
              height="300px"
            />
          </Fragment>
        )}
        {orderStatus === "DELIVERED" && (
          <Fragment>
            <Typography>
              The wait is over! Enjoy your package.
              <br />
              Please don't forget to submit a review.
            </Typography>
            <br />
            <img
              alt="delivered"
              src="/images/order_delivered.svg"
              width="80%"
              height="300px"
            />
          </Fragment>
        )}
      </Grid>
    </Grid>
  );
};

const OrderDetails = ({ match }) => {
  const dispatch = useDispatch();
  const useStyles = makeStyles((theme) => ({
    listItem: {
      display: "flex",
      justifyContent: "center",
    },
    total: {
      fontWeight: 700,
    },
    title: {
      marginLeft: "15px",
    },
  }));
  const classes = useStyles();

  const { alertState } = useContext(AppContext);
  const [, setAlert] = alertState;
  const [pageError, setPageError] = useState(null);
  const [page, setPage] = useState("status");

  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const {
    items_price: itemsPrice,
    tax_price: taxPrice,
    shipping_price: shippingPrice,
    total_price: totalPrice,
    order_status: orderStatus,
    placed_on: createdOn,
    order_items: orderItems,
  } = { ...order };

  useEffect(() => {
    dispatch(getOrderDetails(match.params.id));
    dispatch({ type: CREATE_ORDER_RESET });
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (error) {
      setPageError(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, setAlert]);

  return (
    <div>
      {!pageError ? (
        <Grid
          className="orderDetails__main"
          direction="row"
          container
          justifyContent="center"
        >
          {!loading && order && <MetaData title={`Order #${order.order_id}`} />}
          <Grid
            item
            component={Card}
            elevation={5}
            xs={12}
            md={8}
            style={{ border: "1px solid lightgray" }}
          >
            <Grid container>
              <Grid item xs={12} md={8}>
                <Typography
                  className="orderDetails__main__heading"
                  variant="h4"
                >
                  {!loading && order ? (
                    `Order #${order.order_id}`
                  ) : (
                    <Skeleton animation="wave" />
                  )}
                </Typography>
              </Grid>
              {/* <Grid item xs={4} md={3}>
                            <Status status={orderStatus} size="large" />
                          </Grid> */}
              <Grid item xs={8} md={3}>
                <Typography
                  className="orderDetails__main__heading"
                  variant="h4"
                >
                  {!loading && order ? (
                    // <Status status={
                    //   paymentInfo ? "Paid"
                    //   : "Not Paid"
                    // } size="large" />
                    <Status status={orderStatus} size="large" />
                  ) : (
                    <Skeleton variant="rect" animation="wave" />
                  )}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                justifyContent="center"
                className="orderDetails__main__bar"
              >
                <Grid item xs={6}>
                  <Grid
                    direction="row"
                    component={Button}
                    container
                    onClick={() => setPage("status")}
                  >
                    <Grid item xs={12}>
                      <Typography className="orderDetails__main__bar__label">
                        <InfoIcon /> Status
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid
                    direction="row"
                    component={Button}
                    container
                    onClick={() => setPage("details")}
                  >
                    <Grid item xs={12}>
                      <Typography className="orderDetails__main__bar__label">
                        <ListIcon /> Details
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {page === "status" ? (
                !loading && order ? (
                  <OrderStatus orderStatus={orderStatus} steps={steps} />
                ) : (
                  <Skeleton
                    animation="wave"
                    variant="rect"
                    height={400}
                    style={{ margin: "25px" }}
                  />
                )
              ) : (
                page === "details" && (
                  <Grid
                    container
                    direction="column"
                    align="center"
                    className="orderDetails__main__details"
                  >
                    <List disablePadding>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          {!loading && order ? (
                            <Grid container>
                              <Typography
                                variant="h5"
                                className={classes.title}
                              >
                                Items
                              </Typography>
                              {orderItems?.map((product) => (
                                <Grid item xs={12}>
                                  <ListItem key={product.product_id}>
                                    <ListItemAvatar>
                                      <Avatar
                                        variant="square"
                                        src={
                                          product.product.product_images[0]
                                            .image_url
                                        }
                                        alt=""
                                        imgProps={{
                                          style: {
                                            width: "100%",
                                            objectFit: "contain",
                                          },
                                        }}
                                      />
                                    </ListItemAvatar>
                                    <Link
                                      className="product__info__link"
                                      to={`/product/${product.product_id}`}
                                    >
                                      <ListItemText
                                        style={{ width: "85%" }}
                                        primary={product.product.name}
                                        secondary={
                                          product.quantity > 1
                                            ? `${product.quantity} units`
                                            : `${product.quantity} unit`
                                        }
                                      />
                                    </Link>

                                    {product.discounted_total ? (
                                      <Fragment>
                                        <Typography
                                          variant="body2"
                                          style={{ marginLeft: "auto" }}
                                        >
                                          <strike>
                                            Rs.
                                            {Number(product.line_total).toFixed(
                                              2
                                            )}
                                          </strike>
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          style={{ marginLeft: "auto" }}
                                        >
                                          Rs.
                                          {Number(
                                            product.discounted_total
                                          ).toFixed(2)}
                                        </Typography>
                                      </Fragment>
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        style={{ marginLeft: "auto" }}
                                      >
                                        Rs.
                                        {Number(product.line_total).toFixed(2)}
                                      </Typography>
                                    )}
                                  </ListItem>
                                </Grid>
                              ))}
                              <Grid item xs={12}>
                                <ListItem className={classes.listItem}>
                                  <ListItemText primary="Cummulative" />
                                  <Typography
                                    variant="subtitle1"
                                    className={classes.total}
                                  >
                                    Rs.{itemsPrice.toFixed(2)}
                                  </Typography>
                                </ListItem>
                              </Grid>
                            </Grid>
                          ) : (
                            <Skeleton
                              variant="rect"
                              animation="wave"
                              height={220}
                            />
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          {!loading && order ? (
                            <Grid container>
                              <Typography
                                variant="h5"
                                className={classes.title}
                              >
                                Breakdown
                              </Typography>
                              <Grid item xs={12}>
                                <ListItem className={classes.listItem}>
                                  <ListItemText primary="Base Total" />
                                  <Typography
                                    variant="subtitle1"
                                    className={classes.total}
                                  >
                                    Rs.{itemsPrice.toFixed(2)}
                                  </Typography>
                                </ListItem>
                              </Grid>
                              <Grid item xs={12}>
                                <ListItem className={classes.listItem}>
                                  <ListItemText primary="Delivery Charges" />
                                  <Typography
                                    variant="subtitle1"
                                    className={classes.total}
                                  >
                                    Rs.{shippingPrice.toFixed(2)}
                                  </Typography>
                                </ListItem>
                              </Grid>
                              <Grid item xs={12}>
                                <ListItem className={classes.listItem}>
                                  <ListItemText primary="Tax" />
                                  <Typography
                                    variant="subtitle1"
                                    className={classes.total}
                                  >
                                    Rs.{taxPrice.toFixed(2)}
                                  </Typography>
                                </ListItem>
                              </Grid>
                              <Grid item xs={12}>
                                <ListItem className={classes.listItem}>
                                  <ListItemText primary="Total" />
                                  <Typography
                                    variant="h4"
                                    className={classes.total}
                                  >
                                    Rs.{totalPrice.toFixed(2)}
                                  </Typography>
                                </ListItem>
                              </Grid>
                            </Grid>
                          ) : (
                            <Skeleton
                              variant="rect"
                              animation="wave"
                              height={220}
                            />
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          {!loading && order ? (
                            <Grid
                              container
                              justify="flex-start"
                              align="left"
                              style={{ marginLeft: "15px" }}
                            >
                              <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom>
                                  Shipping Details
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography gutterBottom>
                                  <strong>Name: </strong>
                                  {order.user.full_name}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography gutterBottom>
                                  <strong>Phone: </strong>
                                  {order.phone_number}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography gutterBottom>
                                  <strong>Address: </strong>
                                  {[
                                    order.address,
                                    order.city,
                                    order.country,
                                  ].join(", ")}
                                </Typography>
                              </Grid>
                            </Grid>
                          ) : (
                            <Skeleton
                              variant="rect"
                              animation="wave"
                              height={150}
                            />
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          {!loading && order ? (
                            <Grid container>
                              <Typography
                                variant="h5"
                                className={classes.title}
                              >
                                Additional Details
                              </Typography>
                              <Grid item xs={12}>
                                <ListItem className={classes.listItem}>
                                  <ListItemText primary="Payment Status" />
                                  <Typography
                                    variant="subtitle1"
                                    className={classes.total}
                                  >
                                    <Status status={order.payment_status} />
                                  </Typography>
                                </ListItem>
                              </Grid>
                              <Grid item xs={12}>
                                <ListItem className={classes.listItem}>
                                  <ListItemText primary="Placed on" />
                                  <Typography
                                    variant="subtitle1"
                                    className={classes.total}
                                  >
                                    {String(createdOn).substring(0, 10)}
                                  </Typography>
                                </ListItem>
                              </Grid>
                            </Grid>
                          ) : (
                            <Skeleton
                              variant="rect"
                              animation="wave"
                              height={150}
                            />
                          )}
                        </Grid>
                      </Grid>
                    </List>
                  </Grid>
                )
              )}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <PageError severity="error" error={pageError} />
      )}
    </div>
  );
};

export default OrderDetails;
