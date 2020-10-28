import * as actionTypes from "./types";

export const fetchMenuRequest = () => {
  return {
    type: actionTypes.FETCH_MENU_REQUEST,
  };
};

export const fetchMenuSuccess = (menus) => {
  return {
    type: actionTypes.FETCH_MENU_SUCCESS,
    menus: menus,
  };
};

export const fetchMenuFailure = () => {
  return {
    type: actionTypes.FETCH_MENU_FAILURE,
  };
};

export const addMenuRequest = () => {
  return {
    type: actionTypes.ADD_MENU_REQUEST,
  };
};

export const addMenuSuccess = (menu) => {
  return {
    type: actionTypes.ADD_MENU_SUCCESS,
    menu: menu,
  };
};

export const addMenuFailure = () => {
  return {
    type: actionTypes.ADD_MENU_FAILURE,
  };
};

export const editMenuRequest = () => {
  return {
    type: actionTypes.EDIT_MENU_REQUEST,
  };
};

export const editMenuSuccess = (menu) => {
  return {
    type: actionTypes.EDIT_MENU_SUCCESS,
    menu: menu,
  };
};

export const editMenuFailure = () => {
  return {
    type: actionTypes.EDIT_MENU_FAILURE,
  };
};

export const deleteMenuRequest = () => {
  return {
    type: actionTypes.DELETE_MENU_REQUEST,
  };
};

export const deleteMenuSuccess = (menu) => {
  return {
    type: actionTypes.DELETE_MENU_SUCCESS,
    menu: menu,
  };
};

export const deleteMenuFailure = () => {
  return {
    type: actionTypes.DELETE_MENU_FAILURE,
  };
};
