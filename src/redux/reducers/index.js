import { combineReducers } from "redux";
import auth from "./auth";
import user from "./user";
import category from "./category";
import menu from "./menu";
import cart from "./cart";
import order from "./order";

const rootReducers = combineReducers({
  auth: auth,
  user: user,
  category: category,
  menu: menu,
  cart: cart,
  order: order,
});

export default rootReducers;
