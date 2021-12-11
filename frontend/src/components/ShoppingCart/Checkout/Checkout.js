import React, { useState, useContext, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import {
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  ThemeProvider,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { AppContext, CheckoutContext } from "../../../context/AppContext";
import { countries } from "countries-list";
import {
  clearCart,
  processPayment,
  saveShippingInfo,
} from "../../../actions/cartActions";
import { Link } from "react-router-dom";
import "../../Product/ProductCard/styles/ProductCard.css";
import MetaData from "../../Layout/MetaData/MetaData";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeInput from "../../Misc/StripeElements/StripeInput";
import { titleTheme } from "../../Home/Home";
import { MaximumRed, MaximumYellowRed } from "../../Misc/Colors/Colors";
import PageAlert from "../../Misc/PageAlert/PageAlert";
import { clearErrors, createOrder } from "../../../actions/orderActions";
import { CREATE_ORDER_RESET } from "../../../constants/orderConstants";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
    backgroundColor: MaximumYellowRed,
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

function Review({ params, cardDetails, cashOnDelivery }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { error, success, loadingOrder } = useSelector(
    (state) => state.newOrder
  );
  const { cartItems, shippingInfo, loading } = useSelector(
    (state) => state.cart
  );
  const { orderInfoState, activeStepState } = useContext(CheckoutContext);
  const { alertState } = useContext(AppContext);
  const [, setAlert] = alertState;
  const [orderInfo, setOrderInfo] = orderInfoState;
  const [, setActiveStep] = activeStepState;

  const products = cartItems.map((item) => ({
    productID: item.productID,
    image: item.image,
    name: item.name,
    price: item.price,
    desc:
      item.quantity > 1 ? `${item.quantity} units` : `${item.quantity} unit`,
    qty: item.quantity,
  }));
  const addresses = [
    shippingInfo.address,
    shippingInfo.city,
    shippingInfo.province,
    shippingInfo.postalCode,
    shippingInfo.country,
  ];

  const basePrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const totalUnits = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity),
    0
  );
  const deliveryCharges = basePrice < 100 ? 0.15 * basePrice : 0;
  const tax = 0.05 * basePrice;
  const totalPrice = basePrice + deliveryCharges + tax;

  useEffect(() => {
    setOrderInfo({
      itemsPrice: basePrice,
      shippingPrice: deliveryCharges,
      taxPrice: tax,
      totalPrice,
    });
  }, [basePrice, deliveryCharges, tax, totalPrice, setOrderInfo]);

  useEffect(() => {
    if (success) {
      setAlert({ type: "success", message: "Order successfully placed" });
      setActiveStep(steps.length);
    }
  }, [dispatch, setActiveStep, setAlert, success]);

  const useStyles = makeStyles((theme) => ({
    listItem: {
      padding: theme.spacing(1, 0),
    },
    total: {
      fontWeight: 700,
    },
    title: {
      marginTop: theme.spacing(2),
    },
  }));
  const classes = useStyles();

  const placeOrder = () => {
    if (cashOnDelivery) {
      const order = {
        orderItems: cartItems,
        shippingInfo,
        itemsPrice: orderInfo.itemsPrice,
        taxPrice: orderInfo.taxPrice,
        totalPrice: orderInfo.totalPrice,
        shippingPrice: orderInfo.shippingPrice,
        paymentInfo: {
          paymentMethod: "CASH ON DELIVERY",
        },
      };
      dispatch(createOrder(order));
    } else {
      dispatch(processPayment(...params));
    }
  };

  return (
    <React.Fragment>
      <List disablePadding>
        {products.map((product) => (
          <ListItem className={classes.listItem} key={product.productID}>
            <ListItemAvatar>
              <Avatar
                variant="square"
                src={product.image}
                alt=""
                imgProps={{ style: { width: "100%", objectFit: "contain" } }}
              />
            </ListItemAvatar>
            <Link
              className="product__info__link"
              to={`/product/${product.productID}`}
            >
              <ListItemText
                style={{ width: "85%" }}
                primary={product.name}
                secondary={product.desc}
              />
            </Link>
            <Typography variant="body2">
              Rs.{Number(product.price * product.qty).toFixed(2)}
            </Typography>
          </ListItem>
        ))}
        <ListItem className={classes.listItem}>
          <ListItemText primary="Base Total" />
          <Typography variant="subtitle1" className={classes.total}>
            Rs.{basePrice.toFixed(2)}
          </Typography>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText primary="Delivery Charges" />
          <Typography variant="subtitle1" className={classes.total}>
            Rs.{deliveryCharges.toFixed(2)}
          </Typography>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText primary="Tax" />
          <Typography variant="subtitle1" className={classes.total}>
            Rs.{tax.toFixed(2)}
          </Typography>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" className={classes.total}>
            Rs.{totalPrice.toFixed(2)}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Shipping
          </Typography>
          <Typography gutterBottom>
            <strong>Name: </strong>
            {user.full_name}
          </Typography>
          <Typography gutterBottom>
            <strong>Phone: </strong>
            {shippingInfo.phoneNo}
          </Typography>
          <Typography gutterBottom>
            <strong>Address: </strong>
            {addresses.join(", ")}
          </Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          {/* <Typography variant="h6" gutterBottom className={classes.title}>
              Payment details
            </Typography> */}
          {/* <Grid container>
              {payments.map((payment) => (
                <React.Fragment key={payment.name}>
                  <Grid item xs={6}>
                    <Typography gutterBottom>{payment.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom>{payment.detail}</Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid> */}
        </Grid>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={placeOrder}
          disabled={loading || loadingOrder}
        >
          {loading || loadingOrder ? <CircularProgress /> : `Place Order`}
        </Button>
      </Grid>
    </React.Fragment>
  );
}

function AddressForm() {
  const {
    addressState,
    cityState,
    postalCodeState,
    phoneNoState,
    countryState,
    provinceState,
  } = useContext(CheckoutContext);

  const [address, setAddress] = addressState;
  const [city, setCity] = cityState;
  const [postalCode, setPostalCode] = postalCodeState;
  const [phoneNo, setPhoneNo] = phoneNoState;
  const [province, setProvince] = provinceState;
  const [country, setCountry] = countryState;

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            variant="filled"
            id="address"
            name="address"
            label="Address"
            fullWidth
            autoComplete="shipping address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            variant="filled"
            id="phoneNo"
            name="phoneNo"
            label="Phone Number"
            fullWidth
            autoComplete="phone number"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            variant="filled"
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="filled"
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            variant="filled"
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Country</InputLabel>
            <Select
              required
              variant="filled"
              id="country"
              name="country"
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{ display: "flex", alignItems: "center" }}
            >
              {Object.entries(countries).map((country) => (
                <MenuItem
                  key={country[1].name}
                  value={country[1].name}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <em>{country[1].name}</em>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
              label="Use this address for payment details"
            />
          </Grid> */}
      </Grid>
    </React.Fragment>
  );
}

function PaymentForm({ step, orderInfo }) {
  const elements = useElements();
  const stripe = useStripe();
  const dispatch = useDispatch;

  const { user } = useSelector((state) => state.auth);
  const context = useContext(CheckoutContext);
  const { cardState } = context;
  const [cardName, setCardName] = useState("");
  const [paymentData, setPaymentData] = useState({});
  const [cashOnDelivery, setCashOnDelivery] = useState(false);

  const options = {
    style: {
      base: {
        fontSize: "16px",
      },
      invalid: {
        color: MaximumRed,
      },
    },
  };

  useEffect(() => {
    setPaymentData({
      amount: orderInfo ? Math.round(orderInfo.totalPrice * 100) : 0,
    });
  }, [orderInfo]);

  return (
    <React.Fragment>
      <div style={{ display: step === 2 ? "block" : "none" }}>
        <Review
          params={[
            paymentData,
            stripe,
            elements,
            CardNumberElement,
            cardName,
            user.email,
          ]}
          cardDetails={elements?.getElement(CardNumberElement)}
          cashOnDelivery={cashOnDelivery}
        />
      </div>
      <Grid container spacing={3} style={{ display: step !== 1 && "none" }}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            variant="filled"
            id="cardName"
            label="Name on card"
            fullWidth
            autoComplete="cc-name"
            value={cardName || ""}
            onChange={(e) => setCardName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            variant="filled"
            required
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardNumberElement,
                options,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            variant="filled"
            required
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardExpiryElement,
                options,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            variant="filled"
            required
            id="cvv"
            label="CVV"
            helperText="Last three digits on signature strip"
            fullWidth
            autoComplete="cc-csc"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardCvcElement,
                options,
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={cashOnDelivery}
                onChange={(e) => setCashOnDelivery(e.target.checked)}
                color="primary"
                name="cashOnDelivery"
              />
            }
            label="Pay with cash on delivery instead"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const steps = ["Shipping address", "Payment details", "Review your order"];

export default function Checkout({ openState }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { alertState, stripeApiKey } = useContext(AppContext);
  const [alert, setAlert] = alertState;
  const [openCheckout, setOpenCheckout] = openState;
  const [activeStep, setActiveStep] = React.useState(0);

  const { order, orderError, loadingOrder } = useSelector(
    (state) => state.newOrder
  );
  const { cartItems, shippingInfo, result, error, loading } = useSelector(
    (state) => state.cart
  );
  const [address, setAddress] = useState(shippingInfo?.address || "");
  const [city, setCity] = useState(shippingInfo?.city || "");
  const [postalCode, setPostalCode] = useState(shippingInfo?.postalCode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo || "");
  const [province, setProvince] = useState(shippingInfo?.province || "");
  const [country, setCountry] = useState(shippingInfo?.country || "");
  const [orderInfo, setOrderInfo] = useState(
    sessionStorage.getItem("orderInfo") || {}
  );

  useEffect(() => {
    if (
      Object.keys(orderInfo).length === 0 &&
      orderInfo.constructor === Object
    ) {
      setActiveStep(0);
    }
  }, [orderInfo]);

  useEffect(() => {
    if (activeStep === steps.length) return;
    if (error) {
      setAlert({ type: "error", message: error });
      dispatch(clearErrors());
    }
    if (orderError) {
      setAlert({ type: "error", message: orderError });
      dispatch(clearErrors());
    }
    if (result && activeStep === 2) {
      const order = {
        orderItems: cartItems,
        shippingInfo,
        itemsPrice: orderInfo.itemsPrice,
        taxPrice: orderInfo.taxPrice,
        totalPrice: orderInfo.totalPrice,
        shippingPrice: orderInfo.shippingPrice,
        paymentInfo: {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
          paymentMethod: "CARD",
        },
      };
      dispatch(createOrder(order));
      setAlert({ type: "success", message: "Order successfully placed" });
      setActiveStep(steps.length);
    }
  }, [
    error,
    result,
    setAlert,
    dispatch,
    orderError,
    cartItems,
    orderInfo,
    shippingInfo,
    activeStep,
  ]);

  const states = {
    addressState: [address, setAddress],
    cityState: [city, setCity],
    postalCodeState: [postalCode, setPostalCode],
    phoneNoState: [phoneNo, setPhoneNo],
    countryState: [country, setCountry],
    provinceState: [province, setProvince],
    orderInfoState: [orderInfo, setOrderInfo],
    activeStepState: [activeStep, setActiveStep],
  };

  const handleNext = () => {
    if (activeStep === 0) {
      dispatch(
        saveShippingInfo({
          address,
          phoneNo,
          city,
          postalCode,
          province,
          country,
        })
      );
    } else if (activeStep === 1) {
      saveOrderInfo();
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleClose = () => {
    setOpenCheckout(false);
    if (activeStep === steps.length) {
      sessionStorage.removeItem("orderInfo");
      setOrderInfo({});
      dispatch({ type: CREATE_ORDER_RESET });
    }
    if (activeStep === 2) {
      setActiveStep(1);
    }
  };

  const saveOrderInfo = () => {
    sessionStorage.setItem("orderInfo", JSON.stringify(orderInfo));
  };

  return (
    <CheckoutContext.Provider value={states}>
      <Dialog
        fullScreen
        open={openCheckout}
        PaperProps={{ style: { backgroundColor: MaximumYellowRed } }}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <MetaData title="Checkout" />
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Checkout
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.layout}>
          <Paper className={classes.paper} elevation={5}>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <ThemeProvider theme={titleTheme}>
              <Typography component="h1" variant="h4" align="center">
                {steps[activeStep]}
              </Typography>
            </ThemeProvider>
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <center>
                    <object
                      aria-label="order confirmed"
                      type="image/svg+xml"
                      data="images/order_confirmed.svg"
                      width="300px"
                    />
                  </center>
                  <Typography variant="h5" gutterBottom>
                    Thank you for your order.
                  </Typography>
                  <Typography variant="subtitle1">
                    {`Your order number is #${order?.order_id}. `}{" "}
                    <Link to={`/order/${order?.order_id}`}>
                      Track your order
                    </Link>
                  </Typography>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div style={{ padding: "20px 0" }}>
                    <div
                      style={{ display: activeStep === 0 ? "block" : "none" }}
                    >
                      <AddressForm />
                    </div>
                    <div
                      style={{
                        display:
                          activeStep === 1 || activeStep === 2
                            ? "block"
                            : "none",
                      }}
                    >
                      {stripeApiKey && (
                        <Elements stripe={loadStripe(stripeApiKey)}>
                          <PaymentForm
                            step={activeStep}
                            orderInfo={orderInfo}
                          />
                        </Elements>
                      )}
                    </div>
                  </div>
                  <div className={classes.buttons}>
                    {activeStep !== 0 && (
                      <Button
                        onClick={handleBack}
                        className={classes.button}
                        disabled={loading || loadingOrder}
                      >
                        Back
                      </Button>
                    )}
                    {activeStep !== steps.length - 1 && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                        disabled={
                          error || loading || loadingOrder || orderError
                        }
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          </Paper>
        </div>
        {alert && alert.message !== "Item Added to Cart" && (
          <PageAlert type={alert.type} message={alert.message} />
        )}
      </Dialog>
    </CheckoutContext.Provider>
  );
}
