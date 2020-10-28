import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Welcome = () => {
  const token = useSelector((state) => state.auth.token);

  return (
    <div className="h-screen min-h-screen flex flex-col">
      <div className="py-4">
        <div className="flex items-center justify-between container mx-auto">
          <div className="text-lg text-gray-800 font-semibold">
            Foodstore
          </div>

          {token ? (
            <Link className="text-sm text-white font-medium bg-indigo-800 rounded-lg px-8 py-2" to="/menu">Menu</Link>
          ) : (
            <Link className="text-sm text-white font-medium bg-indigo-800 rounded-lg px-8 py-2" to="/login">Login</Link>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div>
          <h6 className="text-3xl text-gray-800 font-bold">
            Welcome to Foodstore
          </h6>{" "}
          <br />{" "}
          <span className="text-lg text-gray-800 font-semibold">
            easy way to order food and manage your order.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
