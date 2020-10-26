import * as actionTypes from "../actions/types";

const initialState = {
  user: null,
  token: null,
  listened: false,
  errors: [],
};

const fetchAuthSuccess = (state, action) => {
  return {
    ...state,
    user: action.data,
    token: action.token,
    listened: true,
  };
};

const fetchAuthFailure = (state) => {
  return { ...state, listened: true };
};

const loginSuccess = (state, action) => {
  localStorage.setItem("token", action.token);

  return {
    ...state,
    user: action.user,
    token: action.token,
    listened: true,
  };
};

const loginFailure = (state, action) => {
  return { ...state, errors: action.errors };
};

const logoutSuccess = (state) => {
  return { ...state, user: null, token: null, listened: true };
};

const logoutFailure = (state, action) => {
  return { ...state, errors: action.errors };
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_AUTH_SUCCESS:
      return fetchAuthSuccess(state, action);
    case actionTypes.FETCH_AUTH_FAILURE:
      return fetchAuthFailure(state);
    case actionTypes.LOGIN_SUCCESS:
      return loginSuccess(state, action);
    case actionTypes.LOGIN_FAILURE:
      return loginFailure(state, action);
    case actionTypes.LOGOUT_SUCCESS:
      return logoutSuccess(state);
    case actionTypes.LOGOUT_FAILURE:
      return logoutFailure(state, action);
    default:
      return state;
  }
};

export default reducers;
