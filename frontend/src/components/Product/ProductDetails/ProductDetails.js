import React, { useEffect, useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import "./styles/ProductDetails.css";
import { Rating, Skeleton } from "@material-ui/lab";
import { CircularProgress, IconButton, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import MetaData from "../../Layout/MetaData/MetaData";
import Carousel from "react-material-ui-carousel";
import DialogPopup from "../../Misc/DialogPopup/DialogPopup";
import Reviews from "../Reviews/Reviews";

import { useDispatch, useSelector } from "react-redux";
import {
  getProductDetails,
  clearErrors,
  newReview,
  getRelatedProducts,
  resetRelatedProducts,
} from "../../../actions/productActions";
import { AppContext } from "../../../context/AppContext";
import { Fragment } from "react";
import { addItemToCart } from "../../../actions/cartActions";
import { NEW_REVIEW_RESET } from "../../../constants/productConstants";
import PageAlert from "../../Misc/PageAlert/PageAlert";
import PageError from "../../Misc/PageError/PageError";
import ProductCard from "../ProductCard/ProductCard";
import ProductSkeleton from "../ProductSkeleton/ProductSkeleton";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage:
      "url(https://i5.walmartimages.com/asr/1223a935-2a61-480a-95a1-21904ff8986c_1.17fa3d7870e3d9b1248da7b1144787f5.jpeg?odnWidth=undefined&odnHeight=undefined&odnBg=ffffff)",
    backgroundRepeat: "no-repeat",
    backgroundColor: "white",
    backgroundSize: "50%",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  btn_orange: {
    backgroundColor: "#F77F00",
    color: "white",
    "&:hover": {
      color: "white",
      backgroundColor: "#dc7100",
    },
  },
  productDetails__details: {
    backgroundColor: "#EAE2B7",
    color: "#281B01",
  },
}));

export function AddRemove({ addOne, removeOne, quantity }) {
  return (
    <div className="productDetails__details__addRemove">
      <IconButton onClick={removeOne} color="secondary" variant="contained">
        <RemoveIcon />
      </IconButton>
      <Typography className="productDetails__details__addRemove__number">
        {quantity}
      </Typography>
      <IconButton onClick={addOne} color="primary" variant="contained">
        <AddIcon />
      </IconButton>
    </div>
  );
}

export default function ProductDetails({ match }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { alertState } = useContext(AppContext);
  const [, setAlert] = alertState;
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading, error, product } = useSelector(
    (state) => state.productDetails
  );
  const { relatedProducts } = useSelector((state) => state.relatedProducts);
  const {
    error: reviewError,
    success,
    loading: reviewLoading,
  } = useSelector((state) => state.newReview);

  const [openDialog, setOpenDialog] = useState(false);
  const [openReviews, setOpenReviews] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [pageError, setPageError] = useState(null);

  const addToCart = () => {
    dispatch(addItemToCart(match.params.id, quantity));
    setAlert({ type: "success", message: "Item Added to Cart" });
  };

  const addOne = () => {
    if (quantity < product.stock) {
      setQuantity((prevQty) => prevQty + 1);
    }
  };

  const removeOne = () => {
    if (quantity > 1) {
      setQuantity((prevQty) => prevQty - 1);
    }
  };

  useEffect(() => {
    dispatch(getProductDetails(match.params.id));
    dispatch(resetRelatedProducts());
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (product.product_categories?.length >= 1) {
      dispatch(
        getRelatedProducts(
          product.product_id,
          product.product_categories[0].category.category_name
        )
      );
    }
  }, [dispatch, product]);

  useEffect(() => {
    if (success) {
      dispatch(getProductDetails(match.params.id));
    }
    if (error) {
      setPageError(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      setAlert({ type: "error", message: reviewError });
      dispatch(clearErrors());
    }
    if (success) {
      setOpenDialog(false);
      setAlert({ type: "success", message: "Review Posted Successfully" });
      dispatch({ type: NEW_REVIEW_RESET });
      setRating(0);
      setReview("");
    }
  }, [dispatch, error, success, reviewError, setAlert, match.params.id]);

  useEffect(() => {
    setDiscount(null);
    if (product) {
      product.product_categories?.forEach((c) => {
        if (c.category.discount !== 0) setDiscount(1 - c.category.discount);
      });
    }
  }, [product]);

  const handleReview = () => {
    const reviewData = new FormData();
    reviewData.set("rating", rating);
    reviewData.set("comment", review);
    dispatch(newReview(reviewData, product.product_id));
  };

  return (
    <div>
      {!pageError ? (
        <Grid container className="productDetails">
          {!loading ? (
            <MetaData
              title={`${product.name}`}
              description={`${product.description}`}
            />
          ) : null}
          <Grid item xs={12} md={7} className="productDetails__images">
            {loading ? (
              <Skeleton animation="wave" height={500} width={500} />
            ) : (
              <Carousel
                navButtonsAlwaysVisible
                animation="slide"
                className="productDetails__images"
              >
                {product.product_images?.map((image, i) => (
                  <img
                    key={image.image_id}
                    src={image.image_url}
                    alt=""
                    className="productDetails__images__image"
                  ></img>
                ))}
              </Carousel>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            component={Paper}
            className={classes.productDetails__details}
            elevation={6}
            square
          >
            <div className={classes.paper}>
              <Typography variant="h4">
                {loading ? (
                  <Fragment>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                  </Fragment>
                ) : (
                  product.name
                )}
              </Typography>
              <Typography variant="subtitle2" style={{ color: "#8D822A" }}>
                {loading ? (
                  <Skeleton animation="wave" />
                ) : (
                  `Product # ${product.product_id}`
                )}
              </Typography>

              {loading ? (
                <center>
                  <Skeleton animation="wave" height={86} width={200} />
                </center>
              ) : (
                <div className="productDetails__details__ratings">
                  <Rating
                    name="half-rating-read"
                    value={product.ratings}
                    precision={0.5}
                    readOnly
                  />
                  <Typography
                    variant="subtitle2"
                    id="no_of_reviews"
                    className="productDetails__details__link"
                    onClick={() => setOpenReviews(true)}
                  >
                    {product.num_reviews}
                    {product.num_reviews !== 1 ? " Reviews" : " Review"}
                  </Typography>
                </div>
              )}
              {discount ? (
                <Fragment>
                  <Typography variant="h4">
                    <strong>
                      <strike>
                        {loading ? (
                          <Skeleton animation="wave" width={128} />
                        ) : (
                          `Rs.${product.price}`
                        )}
                      </strike>
                    </strong>
                  </Typography>
                  <Typography variant="h4">
                    <strong>
                      {loading ? (
                        <Skeleton animation="wave" width={128} />
                      ) : (
                        `Rs.${product.price * discount}`
                      )}
                    </strong>
                  </Typography>
                </Fragment>
              ) : (
                <Typography variant="h4">
                  <strong>
                    {loading ? (
                      <Skeleton animation="wave" width={128} />
                    ) : (
                      `Rs.${product.price}`
                    )}
                  </strong>
                </Typography>
              )}
              {loading ? (
                <Skeleton animation="wave" height={90} width={350} />
              ) : (
                <div className="productDetails__details__addToCart">
                  {product.stock > 0 ? (
                    <Fragment>
                      <AddRemove
                        addOne={addOne}
                        removeOne={removeOne}
                        quantity={quantity}
                      />
                      <Button
                        className={classes.btn_orange}
                        disabled={product.stock === 0}
                        onClick={addToCart}
                      >
                        <Typography variant="button">Add To Cart</Typography>
                      </Button>
                    </Fragment>
                  ) : (
                    <Typography variant="h5" style={{ color: "#D62828" }}>
                      <strong>Out Of Stock</strong>
                    </Typography>
                  )}
                </div>
              )}
              <div className="productDetails__details__description">
                <Typography variant="body1" style={{ color: "#8D822A" }}>
                  {loading ? (
                    <Fragment>
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                    </Fragment>
                  ) : (
                    product.description
                  )}
                </Typography>
              </div>
              <div className="productDetails__details__submitReview">
                <DialogPopup
                  open={openDialog}
                  setOpen={setOpenDialog}
                  title={"Submit A Review"}
                  content={
                    <Fragment>
                      <Rating
                        precision={0.5}
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      />
                      <TextField
                        multiline
                        rows={5}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                      />
                    </Fragment>
                  }
                  actions={
                    <Button
                      className={classes.btn_orange}
                      onClick={handleReview}
                      disabled={reviewLoading || rating === 0 || !review}
                    >
                      <Typography variant="button">
                        {!reviewLoading ? "Submit" : <CircularProgress />}
                      </Typography>
                    </Button>
                  }
                />
                {loading ? (
                  <Skeleton
                    variant="rect"
                    animation="wave"
                    width={132}
                    height={30}
                  />
                ) : (
                  user &&
                  isAuthenticated && (
                    <Button
                      className={classes.btn_orange}
                      disabled={reviewLoading}
                      onClick={() => setOpenDialog(true)}
                    >
                      <Typography variant="button">
                        {reviewLoading ? (
                          <CircularProgress />
                        ) : (
                          "Submit A Review"
                        )}
                      </Typography>
                    </Button>
                  )
                )}
              </div>
            </div>
          </Grid>
          {loading ? (
            <Grid
              xs={12}
              container
              align="center"
              style={{ backgroundColor: "#FFF" }}
              component={Paper}
              elevation={6}
              className="productDetails__relatedProducts"
              square
            >
              <Grid item xs={12}>
                <Typography variant="h5">
                  <Skeleton />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  {[0, 1, 2, 3].map((i) => {
                    return (
                      <Grid key={i} item xs={12} md={3}>
                        <ProductSkeleton key={i} />
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            relatedProducts?.length > 0 && (
              <Grid
                xs={12}
                container
                align="center"
                style={{ backgroundColor: "#FFF" }}
                component={Paper}
                elevation={6}
                className="productDetails__relatedProducts"
                square
              >
                <Grid item xs={12}>
                  <Typography variant="h5">
                    You may also like these products
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    {!loading
                      ? relatedProducts?.map((product) => {
                          return (
                            <Grid xs={6} md={3} item>
                              <ProductCard
                                key={product.product_id}
                                name={product.name}
                                image={product.product_images[0]}
                                price={product.price}
                                productCategories={product.product_categories}
                                ratings={product.ratings}
                                numOfReviews={product.num_reviews}
                                productID={product.product_id}
                              />
                            </Grid>
                          );
                        })
                      : [0, 1, 2, 3].map((i) => {
                          return (
                            <Grid key={i} item xs={12} md={3}>
                              <ProductSkeleton key={i} />
                            </Grid>
                          );
                        })}
                  </Grid>
                </Grid>
              </Grid>
            )
          )}
          {!loading && product && (
            <Reviews
              openState={[openReviews, setOpenReviews]}
              reviews={product.product_reviews}
              productName={product.name}
            />
          )}
        </Grid>
      ) : (
        <PageError severity="error" error={pageError} />
      )}
    </div>
  );
}
