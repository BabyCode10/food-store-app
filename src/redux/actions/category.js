import * as actionTypes from "./types";

export const fetchCategoryRequest = () => {
  return {
    type: actionTypes.FETCH_CATEGORY_REQUEST,
  };
};

export const fetchCategorySuccess = (data) => {
  return {
    type: actionTypes.FETCH_CATEGORY_SUCCESS,
    data: data,
  };
};

export const fetchCategoryFailure = () => {
  return {
    type: actionTypes.FETCH_CATEGORY_FAILURE,
  };
};

export const addCategoryRequest = () => {
  return {
    type: actionTypes.ADD_CATEGORY_REQUEST,
  };
};

export const addCategorySuccess = (data) => {
  return {
    type: actionTypes.ADD_CATEGORY_SUCCESS,
    data: data,
  };
};

export const addCategoryFailure = () => {
  return {
    type: actionTypes.ADD_CATEGORY_FAILURE,
  };
};

export const editCategoryRequest = () => {
  return {
    type: actionTypes.EDIT_CATEGORY_REQUEST,
  };
};

export const editCategorySuccess = (data) => {
  return {
    type: actionTypes.EDIT_CATEGORY_SUCCESS,
    data: data,
  };
};

export const editCategoryFailure = () => {
  return {
    type: actionTypes.EDIT_CATEGORY_FAILURE,
  };
};

export const deleteCategoryRequest = () => {
  return {
    type: actionTypes.DELETE_CATEGORY_REQUEST,
  };
};

export const deleteCategorySuccess = (data) => {
  return {
    type: actionTypes.DELETE_CATEGORY_SUCCESS,
    data: data,
  };
};

export const deleteCategoryFailure = () => {
  return {
    type: actionTypes.DELETE_CATEGORY_FAILURE,
  };
};
