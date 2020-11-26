import React from "react";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import {
  Welcome,
  Login,
  Menu,
  Payment,
  Order,
  Settings,
  SettingMenu,
  SettingCategory,
  SettingUser,
} from "../pages";

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

const Router = () => {
  return (
    <Switch>
      <ProtectedRoute path="/settings/user" component={SettingUser} />
      <ProtectedRoute path="/settings/category" component={SettingCategory} />
      <ProtectedRoute path="/settings/menu" component={SettingMenu} />
      <ProtectedRoute path="/settings" component={Settings} />
      <ProtectedRoute path="/order/:date?" component={Order} />
      <ProtectedRoute path="/payment/" component={Payment} />
      <ProtectedRoute path="/menu/:category?" component={Menu} />
      <GuestRoute path="/login" component={Login} />
      <Route exact path="/" component={Welcome} />
    </Switch>
  );
};

export default Router;
