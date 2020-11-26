import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTransition, animated } from "react-spring";
import NumberFormat from "react-number-format";
import axios from "axios";

import * as actions from "../../../redux/actions";

const Items = ({ search, match, addToCartHandler }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const menu = useSelector((state) => state.menu);

  useEffect(() => {
    const fetchMenu = async () => {
      dispatch(actions.fetchMenuRequest());

      try {
        const menus = await axios.get("/menu", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        dispatch(actions.fetchMenuSuccess(menus.data));
      } catch (error) {
        dispatch(actions.fetchMenuFailure());
      }
    };

    fetchMenu();
  }, [auth, dispatch]);

  const menus = [];
  menu.menus.forEach((menu) => {
    if (menu.name.toUpperCase().indexOf(search.toUpperCase()) === -1) {
      return;
    }

    if (match.params.category && menu.category.slug !== match.params.category) {
      return;
    }

    menus.push(menu);
  });

  const transitionMenus = useTransition(menus, (menu) => menu.id, {
    config: { mass: 1, tension: 500, friction: 50 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const animationMenus = transitionMenus.map(({ item, props, key }) => (
    <animated.button
      key={key}
      style={props}
      className={`relative flex overflow-hidden text-left items-center border-2 rounded-xl group ${
        item.stock
          ? "hover:bg-indigo-700 hover:border-indigo-700"
          : " pointer-events-none"
      } focus:outline-none p-4 mb-4`}
      onClick={() => addToCartHandler(item)}
      disabled={!item.stock}
    >
      <div
        className={`w-24 h-24 flex items-center justify-center overflow-hidden bg-gray-400 rounded-xl mr-4 ${
          item.stock && "group-hover:bg-indigo-500"
        }`}
      >
        {item.url && (
          <img
            className="object-cover w-full text-gray-800 text-sm text-center font-medium"
            src={item.url}
            alt={item.name}
          />
        )}
      </div>
      <div className="flex-1">
        <p
          className={`text-md text-gray-800 font-bold mb-1 ${
            item.stock && "group-hover:text-white"
          }`}
        >
          {item.name}
        </p>

        <p
          className={`text-sm text-gray-600 mb-2 ${
            item.stock && "group-hover:text-gray-300"
          }`}
        >
          {item.description}
        </p>

        <p
          className={`text-md text-gray-800 font-bold ${
            item.stock && "group-hover:text-white"
          }`}
        >
          <NumberFormat
            value={item.price}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"Rp "}
            renderText={(value) => value}
          />
        </p>
      </div>

      {!item.stock && (
        <div className="absolute inset-0 h-full w-full flex items-center justify-center bg-gray-400 opacity-25">
          <h6 className="text-5xl text-gray-800 font-bold">NOT READY</h6>
        </div>
      )}
    </animated.button>
  ));

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">{animationMenus}</div>
  );
};

export default Items;
