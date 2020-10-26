import * as actionTypes from "./types";
import axios from "axios";

const fetchAuthRequest = () => {
  return {
    type: actionTypes.FETCH_AUTH_REQUEST,
  };
};

const fetchAuthSuccess = (data, token) => {
  return {
    type: actionTypes.FETCH_AUTH_SUCCESS,
    data: data,
    token: token,
  };
};

const fetchAuthFailure = () => {
  return {
    type: actionTypes.FETCH_AUTH_FAILURE,
  };
};

export const fetchAuth = (token) => async (dispatch) => {
  dispatch(fetchAuthRequest());

  try {
    const auth = await axios.get("/profile", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(fetchAuthSuccess(auth.data, token));
  } catch (error) {
    localStorage.removeItem("token");

    dispatch(fetchAuthFailure());
  }
};

export const loginRequest = () => {
  return {
    type: actionTypes.LOGIN_REQUEST,
  };
};

export const loginSuccess = (data) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    user: data.user,
    token: data.token,
  };
};

export const loginFailure = (errors) => {
  return {
    type: actionTypes.LOGIN_FAILURE,
    errors: errors,
  };
};

export const logoutRequest = () => {
  return {
    type: actionTypes.LOGOUT_REQUEST,
  };
};

export const logoutSuccess = () => {
  return {
    type: actionTypes.LOGOUT_SUCCESS,
  };
};

export const logoutFailure = (errors) => {
  return {
    type: actionTypes.LOGOUT_FAILURE,
    errors: errors,
  };
};
