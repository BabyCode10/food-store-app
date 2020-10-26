import * as actionTypes from "./types";

const fetchCartRequest = () => {
  return {
    type: actionTypes.FETCH_CART_REQUEST,
  };
};

const fetchCartSuccess = (menus) => {
  return {
    type: actionTypes.FETCH_CART_SUCCESS,
    menus: menus,
  };
};

export const fetchCart = () => (dispatch) => {
  dispatch(fetchCartRequest());

  dispatch(fetchCartSuccess());
};

const addCartRequest = () => {
  return {
    type: actionTypes.ADD_CART_REQUEST,
  };
};

const addCartSuccess = (menu) => {
  return {
    type: actionTypes.ADD_CART_SUCCESS,
    menu: menu,
  };
};

export const addCart = (menu) => (dispatch) => {
  dispatch(addCartRequest());

  dispatch(addCartSuccess(menu));
};

const deleteCartRequest = () => {
  return {
    type: actionTypes.DELETE_CART_REQUEST,
  };
};

const deleteCartSuccess = (menu) => {
  return {
    type: actionTypes.DELETE_CART_SUCCESS,
    menu: menu,
  };
};

export const deleteCart = (menu) => (dispatch) => {
  dispatch(deleteCartRequest());

  dispatch(deleteCartSuccess(menu));
};
