import * as actionTypes from "./types";

export const fetchMenuRequest = () => {
  return {
    type: actionTypes.FETCH_MENU_REQUEST,
  };
};

export const fetchMenuSuccess = (data) => {
  return {
    type: actionTypes.FETCH_MENU_SUCCESS,
    data: data,
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

export const addMenuSuccess = (data) => {
  return {
    type: actionTypes.ADD_MENU_SUCCESS,
    data: data,
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

export const editMenuSuccess = (data) => {
  return {
    type: actionTypes.EDIT_MENU_SUCCESS,
    data: data,
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

export const deleteMenuSuccess = () => {
  return {
    type: actionTypes.DELETE_MENU_SUCCESS,
  };
};

export const deleteMenuFailure = () => {
  return {
    type: actionTypes.DELETE_MENU_FAILURE,
  };
};
