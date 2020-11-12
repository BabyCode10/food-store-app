import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { Search, Trash } from "react-feather";
import { useTransition, animated } from "react-spring";
import NumberFormat from "react-number-format";
import axios from "axios";
import Main from "../../layouts/main";
import * as actions from "../../redux/actions";

const Home = ({ match }) => {
  const [state, setState] = useState({
    search: "",
  });
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const menu = useSelector((state) => state.menu);
  const cart = useSelector((state) => state.cart);
  const number = useSelector((state) => state.order.number);
  const category = useSelector((state) => state.category);

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

    const fetchCategory = async () => {
      dispatch(actions.fetchCategoryRequest());

      try {
        const categories = await axios.get("/category", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        dispatch(actions.fetchCategorySuccess(categories.data));
      } catch (error) {
        dispatch(actions.fetchCategoryFailure());
      }
    };

    fetchCategory();
  }, [auth, dispatch]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCartHandler = (menu) => {
    dispatch(actions.addCart(menu));
  };

  const deleteCartHandler = (menu) => {
    dispatch(actions.deleteCart(menu));
  };

  const categories = category.categories.map((category, index) => (
    <NavLink
      key={index}
      className="border rounded-lg group hover:bg-indigo-700 hover:border-indigo-700 focus:outline-none px-4 py-2 mr-3"
      activeClassName="text-white bg-indigo-700 border-indigo-700"
      to={`/menu/${category.slug}`}
    >
      <div className="text-sm font-medium group-hover:text-white truncate">
        {category.name}
      </div>
    </NavLink>
  ));

  const menus = [];
  menu.menus.forEach((menu) => {
    if (menu.name.toUpperCase().indexOf(state.search.toUpperCase()) === -1) {
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

  const transitionCarts = useTransition(cart.menus, (menu) => menu.id, {
    config: { mass: 1, tension: 500, friction: 50 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const animationCarts = transitionCarts.map(({ item, props, key }) => (
    <animated.li
      key={key}
      style={props}
      className="flex items-center justify-between py-2"
    >
      <div className="w-2/5 flex items-center">
        <div className="min-w-10 h-10 w-10 flex items-center justify-center overflow-hidden bg-gray-400 rounded-lg mr-2">
          {item.url && (
            <img
              className="object-cover w-full text-gray-800 text-xs text-center font-medium truncate"
              src={item.url}
              alt={item.name}
            />
          )}
        </div>

        <p className="text-sm text-gray-800 font-semibold truncate">
          {item.name}
        </p>
      </div>

      <div className="w-1/5 text-sm text-gray-600 text-center font-semibold">
        {item.quantity}x
      </div>

      <div className="w-2/5 flex items-center justify-end text-sm text-gray-600 text-right font-semibold">
        <NumberFormat
          value={item.price}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"Rp "}
          renderText={(value) => <span className="truncate">{value}</span>}
        />

        <button
          className="focus:outline-none ml-4"
          onClick={() => deleteCartHandler(item)}
        >
          <Trash className="text-red-400" height={16} />
        </button>
      </div>
    </animated.li>
  ));

  return (
    <Main>
      <div className="w-3/5 flex flex-col px-8">
        <div className="group flex items-center py-8">
          <Search className="text-gray-300 mr-2" size={20} />

          <input
            className="text-md text-gray-800 w-full bg-transparent focus:outline-none"
            name="search"
            type="text"
            placeholder="Search..."
            defaultValue={state.search}
            onChange={(event) =>
              setState({ ...state, search: event.target.value })
            }
          />
        </div>

        <div className="flex items-center overflow-x-auto text-gray-800 mb-8">
          <NavLink
            className="border rounded-lg group hover:bg-indigo-700 hover:border-indigo-700 px-4 py-2 mr-3"
            activeClassName="text-white bg-indigo-700 border-indigo-700"
            exact
            to="/menu"
          >
            <div className="text-sm font-medium group-hover:text-white">
              All
            </div>
          </NavLink>

          {categories}
        </div>

        <h6 className="text-xl text-gray-800 font-bold mb-8">All Menu</h6>

        <div className="flex-1 flex flex-col overflow-y-auto">
          {animationMenus}
        </div>
      </div>

      <div className="w-2/5 flex flex-col px-8">
        <div className="text-lg text-gray-800 font-semibold py-8">
          {auth.user.name}
        </div>

        <h6 className="text-xl text-gray-800 font-bold mb-8">Details</h6>

        <div className="flex-1 flex flex-col overflow-hidden divide-y-2 divide-gray-500 divide-dashed">
          <div className="flex items-center justify-between pb-4">
            <div className="text-lg text-gray-800 font-semibold">
              Order Number
            </div>

            <div className="text-lg text-indigo-800 font-semibold">
              #{number}
            </div>
          </div>

          <ul className="flex-1 flex flex-col overflow-y-auto">
            {animationCarts}
          </ul>

          <div className="flex flex-col py-2">
            <ul className="mb-8">
              <li className="flex items-center justify-between">
                <div className="text-md text-gray-800 font-semibold">
                  Sub Total
                </div>
                <div className="text-md text-gray-800 font-semibold">
                  <NumberFormat
                    value={cart.subTotal}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp "}
                    renderText={(value) => value}
                  />
                </div>
              </li>

              <li className="flex items-center justify-between">
                <div className="text-md text-gray-800 font-semibold">Tax</div>
                <div className="text-md text-gray-800 font-semibold">
                  <NumberFormat
                    value={cart.tax}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp "}
                    renderText={(value) => value}
                  />
                </div>
              </li>

              <li className="flex items-center justify-between">
                <div className="text-md text-gray-800 font-semibold">Total</div>
                <div className="text-md text-gray-800 font-semibold">
                  <NumberFormat
                    value={cart.subTotal + cart.tax}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp "}
                    renderText={(value) => value}
                  />
                </div>
              </li>
            </ul>

            <Link
              className="bg-indigo-700 text-md text-center text-white font-semibold rounded-lg py-2"
              to="/payment"
            >
              Payment
            </Link>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Home;
