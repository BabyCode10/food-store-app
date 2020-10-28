import * as actionTypes from "../actions/types";

const initialState = {
  orders: [],
  errors: null,
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ORDER_SUCCESS:
      return { ...state, orders: action.orders };
    case actionTypes.ADD_ORDER_SUCCESS:
      localStorage.removeItem("cart");
      
      return { ...state, orders: [...state.orders, action.order] };
    default:
      return state;
  }
};

export default reducers;
