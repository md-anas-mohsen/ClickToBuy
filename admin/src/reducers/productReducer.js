/* eslint-disable prettier/prettier */
import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_RESET,
  NEW_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_RESET,
  DELETE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_RESET,
  UPDATE_PRODUCT_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_RESET,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
  GET_BANNER_REQUEST,
  GET_BANNER_SUCCESS,
  GET_BANNER_FAIL,
  ADD_BANNER_SLIDE_REQUEST,
  ADD_BANNER_SLIDE_SUCCESS,
  ADD_BANNER_SLIDE_FAIL,
  ADD_BANNER_SLIDE_RESET,
  DELETE_BANNER_SLIDE_REQUEST,
  DELETE_BANNER_SLIDE_SUCCESS,
  DELETE_BANNER_SLIDE_FAIL,
  DELETE_BANNER_SLIDE_RESET,
  GET_BANNER_SLIDE_REQUEST,
  UPDATE_BANNER_SLIDE_REQUEST,
  UPDATE_BANNER_SLIDE_FAIL,
  GET_BANNER_SLIDE_FAIL,
  UPDATE_BANNER_SLIDE_SUCCESS,
  UPDATE_BANNER_SLIDE_RESET,
  GET_BANNER_SLIDE_SUCCESS,
} from '../constants/productConstants'

export const productsReducer = (
  state = {
    products: [],
  },
  action,
) => {
  switch (action.type) {
    case ALL_PRODUCTS_REQUEST:
      return {
        loading: true,
        products: [],
      }
    case ALL_PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
      }
    case ALL_PRODUCTS_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const productDetailsReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false,
        product: action.payload,
      }

    case PRODUCT_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export const newProductReducer = (
  state = {
    product: {},
  },
  action,
) => {
  switch (action.type) {
    case NEW_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case NEW_PRODUCT_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        product: action.payload.product,
      }
    case NEW_PRODUCT_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case NEW_PRODUCT_RESET:
      return {
        ...state,
        success: false,
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const productReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_PRODUCT_REQUEST:
    case UPDATE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      }

    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      }
    case DELETE_PRODUCT_FAIL:
    case UPDATE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case DELETE_PRODUCT_RESET:
      return {
        ...state,
        isDeleted: false,
      }

    case UPDATE_PRODUCT_RESET:
      return {
        ...state,
        isUpdated: false,
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case DELETE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      }
    case DELETE_REVIEW_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case DELETE_REVIEW_RESET:
      return {
        ...state,
        isDeleted: false,
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const bannerReducer = (state = { banner: [] }, action) => {
  switch (action.type) {
    case GET_BANNER_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case GET_BANNER_SUCCESS:
      return {
        loading: false,
        banner: action.payload,
      }

    case GET_BANNER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export const newSlideReducer = (state = { slide: null }, action) => {
  switch (action.type) {
    case ADD_BANNER_SLIDE_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case ADD_BANNER_SLIDE_SUCCESS:
      return {
        loading: false,
        success: action.payload,
      }

    case ADD_BANNER_SLIDE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case ADD_BANNER_SLIDE_RESET:
      return {
        ...state,
        success: false,
      }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export const slideReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_BANNER_SLIDE_REQUEST:
    case UPDATE_BANNER_SLIDE_REQUEST:
    case DELETE_BANNER_SLIDE_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case GET_BANNER_SLIDE_SUCCESS:
      return {
        ...state,
        loading: false,
        slide: action.payload,
      }

    case DELETE_BANNER_SLIDE_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      }

    case UPDATE_BANNER_SLIDE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      }

    case GET_BANNER_SLIDE_FAIL:
    case UPDATE_BANNER_SLIDE_FAIL:
    case DELETE_BANNER_SLIDE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case UPDATE_BANNER_SLIDE_RESET:
      return {
        ...state,
        success: false,
      }

    case DELETE_BANNER_SLIDE_RESET:
      return {
        ...state,
        isDeleted: false,
      }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}
