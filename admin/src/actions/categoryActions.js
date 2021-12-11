/* eslint-disable prettier/prettier */
import axios from 'axios'
import {
  GET_CATEGORIES_FAIL,
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  CLEAR_ERRORS,
  NEW_CATEGORY_REQUEST,
  NEW_CATEGORY_SUCCESS,
  NEW_CATEGORY_FAIL,
  GET_CATEGORY_DETAILS_REQUEST,
  GET_CATEGORY_DETAILS_SUCCESS,
  GET_CATEGORY_DETAILS_FAIL,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAIL,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAIL,
} from 'src/constants/categoryConstants'

export const getCategories = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CATEGORIES_REQUEST })
    const { data } = await axios.get('/api/admin/categories')
    dispatch({
      type: GET_CATEGORIES_SUCCESS,
      payload: data.categories,
    })
  } catch (error) {
    console.log(error)
    dispatch({
      type: GET_CATEGORIES_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const newCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch({
      type: NEW_CATEGORY_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post('/api/admin/categories', categoryData, config)

    dispatch({
      type: NEW_CATEGORY_SUCCESS,
      payload: data,
    })
  } catch (error) {
    console.log(error)
    dispatch({
      type: NEW_CATEGORY_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const getCategoryDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_CATEGORY_DETAILS_REQUEST })

    const { data } = await axios.get(`/api/admin/categories/${id}`)
    dispatch({
      type: GET_CATEGORY_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: GET_CATEGORY_DETAILS_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const updateCategory = (categoryId, categoryData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CATEGORY_REQUEST })
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    console.log(categoryId)
    const { data } = await axios.put(`/api/admin/categories/${categoryId}`, categoryData, config)
    dispatch({
      type: UPDATE_CATEGORY_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: UPDATE_CATEGORY_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const deleteCategory = (categoryId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_CATEGORY_REQUEST })
    console.log(categoryId)
    const { data } = await axios.delete(`/api/admin/categories/${categoryId}`)
    dispatch({
      type: DELETE_CATEGORY_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: DELETE_CATEGORY_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  })
}
