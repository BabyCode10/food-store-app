import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import {
  Welcome,
  Login,
  Menu,
  Payment,
  Settings,
  SettingMenu,
  SettingCategory,
  SettingUser,
} from "./pages";
import * as actions from "./redux/actions";

axios.defaults.baseURL = "http://food-store.test/api";

const App = () => {
  const token = localStorage.getItem("token");
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuth = async () => {
      dispatch(actions.fetchAuth(token));
    };

    fetchAuth();

    dispatch(actions.fetchCart());
  }, [token, dispatch]);

  return auth.listened ? (
    <Switch>
      <ProtectedRoute path="/settings/user" component={SettingUser} />
      <ProtectedRoute path="/settings/category" component={SettingCategory} />
      <ProtectedRoute path="/settings/menu" component={SettingMenu} />
      <ProtectedRoute path="/settings" component={Settings} />
      <ProtectedRoute path="/payment" component={Payment} />
      <ProtectedRoute path="/menu/:category?" component={Menu} />
      <GuestRoute path="/login" component={Login} />
      <GuestRoute path="/" component={Welcome} />
    </Switch>
  ) : (
    <div className="h-screen min-h-screen flex items-center justify-center">
      Please wait...
    </div>
  );
};

export default App;

const GuestRoute = ({ children, ...rest }) => {
  const auth = useSelector((state) => state.auth);

  let route = <Redirect to="/menu" />;

  if (!auth.token) {
    route = <Route {...rest}>{children}</Route>;
  }

  return route;
};

const ProtectedRoute = ({ children, ...rest }) => {
  const auth = useSelector((state) => state.auth);

  let route = <Redirect to="/login" />;

  if (auth.token) {
    route = <Route {...rest}>{children}</Route>;
  }

  return route;
};
