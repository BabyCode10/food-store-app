import * as actionTypes from "./types";

export const fetchCategoryRequest = () => {
  return {
    type: actionTypes.FETCH_CATEGORY_REQUEST,
  };
};

export const fetchCategorySuccess = (categories) => {
  return {
    type: actionTypes.FETCH_CATEGORY_SUCCESS,
    categories: categories,
  };
};

export const fetchCategoryFailure = () => {
  return {
    type: actionTypes.FETCH_CATEGORY_FAILURE,
  };
};

export const searchCategoryRequest = () => {
  return {
    type: actionTypes.SEARCH_CATEGORY_REQUEST,
  };
};

export const searchCategorySuccess = (categories) => {
  return {
    type: actionTypes.SEARCH_CATEGORY_SUCCESS,
    categories: categories,
  };
};

export const searchCategoryFailure = () => {
  return {
    type: actionTypes.SEARCH_CATEGORY_FAILURE,
  };
};

export const addCategoryRequest = () => {
  return {
    type: actionTypes.ADD_CATEGORY_REQUEST,
  };
};

export const addCategorySuccess = (category) => {
  return {
    type: actionTypes.ADD_CATEGORY_SUCCESS,
    category: category,
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

export const editCategorySuccess = (category) => {
  return {
    type: actionTypes.EDIT_CATEGORY_SUCCESS,
    category: category,
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

export const deleteCategorySuccess = (category) => {
  return {
    type: actionTypes.DELETE_CATEGORY_SUCCESS,
    category: category,
  };
};

export const deleteCategoryFailure = () => {
  return {
    type: actionTypes.DELETE_CATEGORY_FAILURE,
  };
};
