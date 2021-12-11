/* eslint-disable prettier/prettier */
import axios from 'axios'

import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
  GET_BANNER_REQUEST,
  GET_BANNER_SUCCESS,
  GET_BANNER_FAIL,
  DELETE_BANNER_SLIDE_FAIL,
  DELETE_BANNER_SLIDE_SUCCESS,
  DELETE_BANNER_SLIDE_REQUEST,
  ADD_BANNER_SLIDE_FAIL,
  ADD_BANNER_SLIDE_SUCCESS,
  ADD_BANNER_SLIDE_REQUEST,
  GET_BANNER_SLIDE_REQUEST,
  GET_BANNER_SLIDE_SUCCESS,
  GET_BANNER_SLIDE_FAIL,
  UPDATE_BANNER_SLIDE_REQUEST,
  UPDATE_BANNER_SLIDE_SUCCESS,
  UPDATE_BANNER_SLIDE_FAIL,
} from '../constants/productConstants'

export const getProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: ALL_PRODUCTS_REQUEST,
    })
    const { data } = await axios.get('/api/admin/all-products')

    dispatch({
      type: ALL_PRODUCTS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    console.log(error)
    dispatch({
      type: ALL_PRODUCTS_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const getProductDetails = (productID) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })

    const { data } = await axios.get(`/api/products/${productID}`)
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    })
  } catch (error) {
    console.log(error)
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const newProduct = (productData) => async (dispatch) => {
  try {
    dispatch({
      type: NEW_PRODUCT_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post('/api/admin/products', productData, config)

    dispatch({
      type: NEW_PRODUCT_SUCCESS,
      payload: data,
    })
  } catch (error) {
    console.log(error)
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const updateProduct = (productID, productData) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_PRODUCT_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.put(`/api/admin/products/${productID}`, productData, config)

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const deleteProduct = (productID) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_PRODUCT_REQUEST,
    })

    const { data } = await axios.delete(`/api/admin/products/${productID}`)

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data.success,
    })
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const deleteReview = (productID, userID) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_REVIEW_REQUEST,
    })

    const { data } = await axios.delete(
      `/api/admin/reviews?productId=${productID}&userId=${userID}`,
    )

    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: data.success,
    })
  } catch (error) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const getBanner = () => async (dispatch) => {
  try {
    dispatch({ type: GET_BANNER_REQUEST })
    const { data } = await axios.get('/api/banner')
    dispatch({
      type: GET_BANNER_SUCCESS,
      payload: data.banner,
    })
  } catch (error) {
    dispatch({
      type: GET_BANNER_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const addBannerSlide = (slideData) => async (dispatch) => {
  try {
    dispatch({
      type: ADD_BANNER_SLIDE_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post('/api/admin/banner', slideData, config)

    dispatch({
      type: ADD_BANNER_SLIDE_SUCCESS,
      payload: data.success,
    })
  } catch (error) {
    dispatch({
      type: ADD_BANNER_SLIDE_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const deleteBannerSlide = (slideID) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_BANNER_SLIDE_REQUEST,
    })

    const { data } = await axios.delete(`/api/admin/banner/slide/${slideID}`)

    dispatch({
      type: DELETE_BANNER_SLIDE_SUCCESS,
      payload: data.success,
    })
  } catch (error) {
    dispatch({
      type: DELETE_BANNER_SLIDE_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const getBannerSlide = (slideID) => async (dispatch) => {
  try {
    dispatch({
      type: GET_BANNER_SLIDE_REQUEST,
    })

    const { data } = await axios.get(`/api/admin/banner/slide/${slideID}`)

    dispatch({
      type: GET_BANNER_SLIDE_SUCCESS,
      payload: data.slide,
    })
  } catch (error) {
    dispatch({
      type: GET_BANNER_SLIDE_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const updateBannerSlide = (slideData, slideID) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_BANNER_SLIDE_REQUEST,
    })

    const config = {
      'Content-Type': 'application/json',
    }

    const { data } = await axios.put(`/api/admin/banner/slide/${slideID}`, slideData, config)

    dispatch({
      type: UPDATE_BANNER_SLIDE_SUCCESS,
      payload: data.success,
    })
  } catch (error) {
    dispatch({
      type: UPDATE_BANNER_SLIDE_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  })
}
