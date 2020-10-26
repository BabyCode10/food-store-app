import * as actionTypes from "./types";

export const fetchUserRequest = () => {
  return {
    type: actionTypes.FETCH_USER_REQUEST,
  };
};

export const fetchUserSuccess = (data) => {
  return {
    type: actionTypes.FETCH_USER_SUCCESS,
    data: data,
  };
};

export const fetchUserFailure = () => {
  return {
    type: actionTypes.FETCH_USER_FAILURE,
  };
};

export const addUserRequest = () => {
  return {
    type: actionTypes.ADD_USER_REQUEST,
  };
};

export const addUserSuccess = (data) => {
  return {
    type: actionTypes.ADD_USER_SUCCESS,
    data: data,
  };
};

export const addUserFailure = () => {
  return {
    type: actionTypes.ADD_USER_FAILURE,
  };
};

export const editUserRequest = () => {
  return {
    type: actionTypes.EDIT_USER_FAILURE,
  };
};

export const editUserSuccess = (data) => {
  return {
    type: actionTypes.EDIT_USER_SUCCESS,
    data: data,
  };
};

export const editUserFailure = () => {
  return {
    type: actionTypes.EDIT_USER_FAILURE,
  };
};

export const deleteUserRequest = () => {
  return {
    type: actionTypes.DELETE_USER_REQUEST,
  };
};

export const deleteUserSuccess = (data) => {
  return {
    type: actionTypes.DELETE_USER_SUCCESS,
    data: data,
  };
};

export const deleteUserFailure = () => {
  return {
    type: actionTypes.DELETE_USER_FAILURE,
  };
};
