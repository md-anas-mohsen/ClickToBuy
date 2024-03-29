/* eslint-disable prettier/prettier */
import axios from 'axios'
import {
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  ALL_ORDERS_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  CLEAR_ERRORS,
} from '../constants/orderConstants'

export const allOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ORDERS_REQUEST })

    const { data } = await axios.get('/api/admin/orders/')
    dispatch({
      type: ALL_ORDERS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST })

    const { data } = await axios.get(`/api/admin/orders/${id}`)
    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data.order,
    })
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const processOrder = (orderID, orderData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ORDER_REQUEST })
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { data } = await axios.put(`/api/admin/orders/${orderID}`, orderData, config)
    dispatch({
      type: UPDATE_ORDER_SUCCESS,
      payload: data.success,
    })
  } catch (error) {
    console.log(error)
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const deleteOrder = (orderID, orderData) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ORDER_REQUEST })
    const { data } = await axios.delete(`/api/admin/orders/${orderID}`, orderData)
    dispatch({
      type: DELETE_ORDER_SUCCESS,
      payload: data.success,
    })
  } catch (error) {
    console.log(error)
    dispatch({
      type: DELETE_ORDER_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS })
}
