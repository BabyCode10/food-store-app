import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { Search, Trash } from "react-feather";
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

  const categories = [];
  category.categories.forEach((category, index) => {
    categories.push(
      <NavLink
        key={index}
        className="border rounded-lg group hover:bg-indigo-700 hover:border-indigo-700 px-4 py-2 mr-3"
        activeClassName="text-white bg-indigo-700 border-indigo-700"
        to={`/menu/${category.slug}`}
      >
        <div className="text-sm font-medium group-hover:text-white truncate">
          {category.name}
        </div>
      </NavLink>
    );
  });

  const menus = [];
  menu.menus.forEach((menu, index) => {
    if (menu.name.toUpperCase().indexOf(state.search.toUpperCase()) === -1) {
      return;
    }

    if (match.params.category && menu.category.slug !== match.params.category) {
      return;
    }

    if (!menu.stock) {
      menus.push(
        <div
          key={index}
          className="relative flex items-center overflow-hidden text-left border-2 rounded-xl p-4 mb-4"
        >
          <div className="w-24 h-24 bg-gray-400 rounded-xl mr-4"></div>

          <div className="flex-1">
            <p className="text-md text-gray-800 font-bold mb-1">{menu.name}</p>

            <p className="text-sm text-gray-600 mb-2">{menu.description}</p>

            <p className="text-md text-gray-800 font-bold">
              <NumberFormat
                value={menu.price}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp "}
                renderText={(value) => value}
              />
            </p>
          </div>

          <div className="absolute inset-0 h-full w-full flex items-center justify-center bg-gray-400 opacity-25">
            <h6 className="text-5xl text-gray-800 font-bold">NOT READY</h6>
          </div>
        </div>
      );

      return;
    }

    menus.push(
      <button
        key={index}
        className="flex text-left items-center border-2 rounded-xl group hover:bg-indigo-700 hover:border-indigo-700 p-4 mb-4"
        onClick={() => addToCartHandler(menu)}
      >
        <div className="w-24 h-24 bg-gray-400 rounded-xl mr-4 group-hover:bg-indigo-500"></div>

        <div className="flex-1">
          <p className="text-md text-gray-800 font-bold mb-1 group-hover:text-white">
            {menu.name}
          </p>

          <p className="text-sm text-gray-600 mb-2 group-hover:text-gray-300">
            {menu.description}
          </p>

          <p className="text-md text-gray-800 font-bold group-hover:text-white">
            <NumberFormat
              value={menu.price}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"Rp "}
              renderText={(value) => value}
            />
          </p>
        </div>
      </button>
    );
  });

  const carts = [];
  cart.menus.forEach((menu, index) => {
    carts.push(
      <li key={index} className="flex items-center justify-between py-2">
        <div className="w-2/5 flex items-center">
          <div className="min-w-10 h-10 bg-gray-400 rounded-lg mr-2"></div>

          <p className="text-sm text-gray-800 font-semibold truncate">
            {menu.name}
          </p>
        </div>

        <div className="w-1/5 text-sm text-gray-600 text-center font-semibold">
          {menu.quantity}x
        </div>

        <div className="w-2/5 flex items-center justify-end text-sm text-gray-600 text-right font-semibold">
          <NumberFormat
            value={menu.price}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"Rp "}
            renderText={(value) => <span className="truncate">{value}</span>}
          />

          <button className="ml-4" onClick={() => deleteCartHandler(menu)}>
            <Trash className="text-red-400" height={16} />
          </button>
        </div>
      </li>
    );
  });

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

        <div className="flex-1 flex flex-col overflow-y-auto">{menus}</div>
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

          <ul className="flex-1 flex flex-col overflow-y-auto">{carts}</ul>

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
