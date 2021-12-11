/* eslint-disable prettier/prettier */
import {
  CLEAR_ERRORS,
  UPDATE_CATEGORY_FAIL,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_RESET,
  UPDATE_CATEGORY_SUCCESS,
  GET_CATEGORIES_FAIL,
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORY_DETAILS_FAIL,
  GET_CATEGORY_DETAILS_REQUEST,
  GET_CATEGORY_DETAILS_SUCCESS,
  NEW_CATEGORY_FAIL,
  NEW_CATEGORY_REQUEST,
  NEW_CATEGORY_RESET,
  NEW_CATEGORY_SUCCESS,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAIL,
  DELETE_CATEGORY_RESET,
} from 'src/constants/categoryConstants'

export const categoriesReducer = (
  state = {
    categories: [],
  },
  action,
) => {
  switch (action.type) {
    case GET_CATEGORIES_REQUEST:
      return {
        loading: true,
        categories: [],
      }
    case GET_CATEGORIES_SUCCESS:
      return {
        loading: false,
        categories: action.payload,
      }
    case GET_CATEGORIES_FAIL:
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

export const newCategoryReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case NEW_CATEGORY_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        message: action.payload.message,
      }
    case NEW_CATEGORY_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case NEW_CATEGORY_RESET:
      return {
        ...state,
        message: null,
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

export const categoryDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CATEGORY_DETAILS_REQUEST:
      return {
        loading: true,
      }
    case GET_CATEGORY_DETAILS_SUCCESS:
      return {
        loading: false,
        category: action.payload.category,
        products: action.payload.products,
      }
    case GET_CATEGORY_DETAILS_FAIL:
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

export const categoryReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_CATEGORY_REQUEST:
    case DELETE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case UPDATE_CATEGORY_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        message: action.payload.message,
      }

    case DELETE_CATEGORY_SUCCESS:
      return {
        loading: false,
        isDeleted: true,
        message: 'Category deleted successfully',
      }
    case UPDATE_CATEGORY_FAIL:
    case DELETE_CATEGORY_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case UPDATE_CATEGORY_RESET:
    case DELETE_CATEGORY_RESET:
      return {
        ...state,
        message: null,
        success: false,
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
