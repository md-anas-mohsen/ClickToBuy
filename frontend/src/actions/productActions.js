import axios from "axios";

import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CLEAR_ERRORS,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  GET_BANNER_REQUEST,
  GET_BANNER_SUCCESS,
  GET_BANNER_FAIL,
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
  RELATED_PRODUCTS_REQUEST,
  RELATED_PRODUCTS_SUCCESS,
  RELATED_PRODUCTS_FAIL,
  RELATED_PRODUCTS_RESET,
} from "../constants/productConstants";

export const getProducts =
  (keyword = "", page = 1, price = [1, 99999999], category, rating = 0) =>
  async (dispatch) => {
    try {
      dispatch({
        type: ALL_PRODUCTS_REQUEST,
      });

      let link = `/api/products?keyword=${keyword.trim()}&page=${page}`;

      if (category) {
        link += `&category=${category}`;
      }

      if (price[0] > 1) {
        link += `&gte=${price[0]}`;
      }

      if (price[1] < 100000) {
        link += `&lte=${price[1]}`;
      }

      if (rating > 0) {
        link += `&ratings=${rating}`;
      }

      console.log(link);

      const { data } = await axios.get(link);

      dispatch({
        type: ALL_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_PRODUCTS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const getProductDetails = (productID) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/products/${productID}`);
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getRelatedProducts = (productID, category) => async (dispatch) => {
  try {
    dispatch({ type: RELATED_PRODUCTS_REQUEST });
    const { data } = await axios.get(
      `/api/related-products/?productId=${productID}&category=${category}`
    );
    dispatch({
      type: RELATED_PRODUCTS_SUCCESS,
      payload: data.relatedProducts,
    });
  } catch (error) {
    dispatch({
      type: RELATED_PRODUCTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const resetRelatedProducts = () => async (dispatch) => {
  dispatch({ type: RELATED_PRODUCTS_RESET });
};

export const newReview = (reviewData, productID) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `/api/products/${productID}`,
      reviewData,
      config
    );
    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getBanner = () => async (dispatch) => {
  try {
    dispatch({ type: GET_BANNER_REQUEST });
    const { data } = await axios.get("/api/banner");
    dispatch({
      type: GET_BANNER_SUCCESS,
      payload: data.banner,
    });
  } catch (error) {
    dispatch({
      type: GET_BANNER_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getCategories = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CATEGORIES_REQUEST });
    const { data } = await axios.get("/api/categories");
    dispatch({
      type: GET_CATEGORIES_SUCCESS,
      payload: data.categories,
    });
  } catch (error) {
    dispatch({
      type: GET_CATEGORIES_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
