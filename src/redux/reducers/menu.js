import * as actionTypes from "../actions/types";

const initialState = {
  menus: [],
};

const fetchMenu = (state, action) => {
  return { ...state, menus: action.menus };
};

const searchMenu = (state, action) => {
  return { ...state, menus: action.menus };
};

const addMenu = (state, action) => {
  return { ...state, menus: [...state.menus, action.menu] };
};

const editMenu = (state, action) => {
  const newMenus = state.menus.map((menu) => {
    if (menu.id === action.menu.id) {
      return action.menu;
    }

    return menu;
  });

  return { ...state, menus: newMenus };
};

const deleteMenu = (state, action) => {
  const newMenus = state.menus.filter((menu) => menu.id !== action.menu.id);

  return { ...state, menus: newMenus };
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_MENU_SUCCESS:
      return fetchMenu(state, action);
    case actionTypes.SEARCH_MENU_SUCCESS:
      return searchMenu(state, action);
    case actionTypes.ADD_MENU_SUCCESS:
      return addMenu(state, action);
    case actionTypes.EDIT_MENU_SUCCESS:
      return editMenu(state, action);
    case actionTypes.DELETE_MENU_SUCCESS:
      return deleteMenu(state, action);
    default:
      return state;
  }
};

export default reducers;
