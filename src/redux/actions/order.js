import * as actionTypes from "./types";
import axios from "axios";

const fetchOrderRequest = () => {
  return {
    type: actionTypes.FETCH_ORDER_REQUEST,
  };
};

const fetchOrderSuccess = (orders) => {
  return {
    type: actionTypes.FETCH_ORDER_SUCCESS,
    orders: orders,
  };
};

const fetchOrderFailure = () => {
  return {
    type: actionTypes.FETCH_ORDER_FAILURE,
  };
};

export const fetchOrder = (token) => async (dispatch) => {
  dispatch(fetchOrderRequest());

  try {
    const orders = await axios.get("/order", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    dispatch(fetchOrderSuccess(orders));
  } catch (error) {
    dispatch(fetchOrderFailure(error.response.data));
  }
};

export const addOrderRequest = () => {
  return {
    type: actionTypes.ADD_CART_REQUEST,
  };
};

export const addOrderSuccess = (order) => {
  return {
    type: actionTypes.ADD_CART_SUCCESS,
    order: order,
  };
};

export const addOrderFailure = () => {
  return {
    type: actionTypes.ADD_CART_FAILURE,
  };
};
