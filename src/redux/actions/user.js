import * as actionTypes from "./types";

export const fetchUserRequest = () => {
  return {
    type: actionTypes.FETCH_USER_REQUEST,
  };
};

export const fetchUserSuccess = (users) => {
  return {
    type: actionTypes.FETCH_USER_SUCCESS,
    users: users,
  };
};

export const fetchUserFailure = () => {
  return {
    type: actionTypes.FETCH_USER_FAILURE,
  };
};

export const searchUserRequest = () => {
  return {
    type: actionTypes.SEARCH_USER_REQUEST,
  };
};

export const searchUserSuccess = (users) => {
  return {
    type: actionTypes.SEARCH_USER_SUCCESS,
    users: users,
  };
};

export const searchUserFailure = () => {
  return {
    type: actionTypes.SEARCH_USER_FAILURE,
  };
};

export const addUserRequest = () => {
  return {
    type: actionTypes.ADD_USER_REQUEST,
  };
};

export const addUserSuccess = (user) => {
  return {
    type: actionTypes.ADD_USER_SUCCESS,
    user: user,
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

export const editUserSuccess = (user) => {
  return {
    type: actionTypes.EDIT_USER_SUCCESS,
    user: user,
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

export const deleteUserSuccess = (user) => {
  return {
    type: actionTypes.DELETE_USER_SUCCESS,
    user: user,
  };
};

export const deleteUserFailure = () => {
  return {
    type: actionTypes.DELETE_USER_FAILURE,
  };
};
