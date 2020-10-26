import * as actionTypes from "../actions/types";

const initialState = {
  categories: [],
};

const fetchCategory = (state, action) => {
  return { ...state, categories: action.data };
};

const addCategory = (state, action) => {
  return {
    ...state,
    categories: [...state.categories, action.data],
  };
};

const editCategory = (state, action) => {
  const newCategories = state.categories.map((category) => {
    if (category.id === action.data.id) {
      return action.data;
    }

    return category;
  });

  return { ...state, categories: newCategories };
};

const deleteCategory = (state, action) => {
  const newCategories = state.categories.filter(
    (category) => category.id !== action.data.id
  );

  return { ...state, categories: newCategories };
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CATEGORY_SUCCESS:
      return fetchCategory(state, action);
    case actionTypes.ADD_CATEGORY_SUCCESS:
      return addCategory(state, action);
    case actionTypes.EDIT_CATEGORY_SUCCESS:
      return editCategory(state, action);
    case actionTypes.DELETE_CATEGORY_SUCCESS:
      return deleteCategory(state, action);
    default:
      return state;
  }
};

export default reducers;
