import * as actionTypes from "../actions/types";

const initialState = {
  menus: [],
  subTotal: 0,
  tax: 0,
  total: 0,
  cash: 0,
};

const fetchCart = (state) => {
  const cart = JSON.parse(localStorage.getItem("cart"));

  return cart;
};

const addCart = (state, action) => {
  let subTotal = state.subTotal;
  let tax = 0;
  const findMenu = state.menus.find((menu) => menu.id === action.menu.id);

  if (findMenu) {
    const newMenus = state.menus.map((menu) => {
      if (menu.id === action.menu.id) {
        menu.quantity += 1;

        subTotal += menu.price;
        tax = (subTotal * 10) / 100;

        return menu;
      }

      return menu;
    });

    return { ...state, menus: newMenus, subTotal: subTotal, tax: tax };
  }

  action.menu.quantity = 1;

  subTotal += action.menu.price;
  tax = (subTotal * 10) / 100;

  return {
    ...state,
    menus: [...state.menus, action.menu],
    subTotal: subTotal,
    tax: tax,
  };
};

const deleteCart = (state, action) => {
  let subTotal = state.subTotal;
  let tax = 0;

  const newMenus = state.menus
    .map((menu) => {
      if (menu.id === action.menu.id) {
        menu.quantity -= 1;

        subTotal -= menu.price;
        tax = (subTotal * 10) / 100;

        return menu;
      }

      return menu;
    })
    .filter((menu) => menu.quantity > 0);

  localStorage.setItem("cart", JSON.stringify(newMenus, subTotal, tax));

  return { ...state, menus: newMenus, subTotal: subTotal, tax: tax };
};

const resetCart = (state) => {
  return { ...state, menus: [], subTotal: 0, tax: 0, total: 0, cash: 0 };
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CART_SUCCESS:
      return fetchCart(state, action);
    case actionTypes.ADD_CART_SUCCESS:
      return addCart(state, action);
    case actionTypes.DELETE_CART_SUCCESS:
      return deleteCart(state, action);
    case actionTypes.RESET_CART_SUCCESS:
      return resetCart(state);
    default:
      return state;
  }
};

export default reducers;
