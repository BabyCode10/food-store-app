import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Grid, List, Settings, LogOut, AlertTriangle } from "react-feather";
import { Modal } from "../components";
import { useTransition } from "react-spring";

import * as actions from "../redux/actions";

const Home = ({ children }) => {
  let dispatch = useDispatch();
  const [showLogout, setShowLogout] = useState(false);
  const token = localStorage.getItem("token");
  const transitions = useTransition(showLogout, null, {
    config: { mass: 1, tension: 500, friction: 50 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const logoutHandler = async () => {
    dispatch(actions.logoutRequest());

    await axios
      .get("/logout", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        localStorage.removeItem("token");

        dispatch(actions.logoutSuccess());
      })
      .catch((error) => {
        dispatch(actions.logoutFailure(error.response.data));
      });
  };

  return (
    <div className="h-screen min-h-screen flex overflow-hidden  bg-gray-100">
      <div className="flex-1 flex overflow-hidden divide-x divide-gray-400">
        <div className="w-1/6 flex flex-col">
          <div className="text-md text-gray-800 font-semibold p-8">
            Foodstore
          </div>

          <div className="flex-1">
            <NavLink
              className="flex items-center text-gray-800 group hover:border-r-4 hover:border-orange-400 focus:outline-none pl-8 py-1 mb-8"
              activeClassName="text-orange-400 border-r-4 border-orange-400"
              to="/menu"
            >
              <Grid className="group-hover:text-orange-400 mr-4" size={20} />

              <span className="text-gray-800">Menu</span>
            </NavLink>

            <NavLink
              className="flex items-center text-gray-800 group hover:border-r-4 hover:border-orange-400 focus:outline-none pl-8 py-1 mb-8"
              activeClassName="text-orange-400 border-r-4 border-orange-400"
              to="/order"
            >
              <List className="group-hover:text-orange-400 mr-4" size={20} />

              <span className="text-gray-800">Orders</span>
            </NavLink>

            <NavLink
              className="flex items-center text-gray-800 group hover:border-r-4 hover:border-orange-400 focus:outline-none pl-8 py-1 mb-8"
              activeClassName="text-orange-400 border-r-4 border-orange-400"
              to="/settings"
            >
              <Settings
                className="group-hover:text-orange-400 mr-4"
                size={20}
              />

              <span className="text-gray-800">Settings</span>
            </NavLink>
          </div>

          <button
            className="flex items-center text-red-400 focus:outline-none pl-8 py-1 my-8"
            onClick={() => setShowLogout(!showLogout)}
          >
            <LogOut className="text-red-400 mr-4" size={20} />
            Logout
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden divide-x divide-gray-400">
          {children}
        </div>
      </div>

      {transitions.map(
        ({ item, key, props: style }) =>
          item && (
            <Modal
              key={key}
              style={style}
              show={showLogout}
              onShow={() => setShowLogout(false)}
            >
              <div className="flex mb-8">
                <div className="mr-4">
                  <div className="bg-yellow-400 rounded-full p-2">
                    <AlertTriangle className="text-yellow-700" size={20} />
                  </div>
                </div>

                <div>
                  <h6 className="text-xl text-gray-800 mb-2">
                    Ready to Leave?
                  </h6>

                  <p className="text-sm text-gray-600">
                    Select "Logout" below if you ready to end.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  className="text-sm text-gray-800 font-medium focus:outline-none px-8 py-2 mr-4"
                  onClick={() => setShowLogout(false)}
                >
                  Cancel
                </button>

                <button
                  className="text-sm text-white bg-indigo-700 rounded-lg focus:outline-none px-8 py-2"
                  onClick={logoutHandler}
                >
                  Logout
                </button>
              </div>
            </Modal>
          )
      )}
    </div>
  );
};

export default Home;
