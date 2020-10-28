import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Main from "../../layouts/main";
import { Search, Minus, ChevronDown } from "react-feather";
import * as actions from "../../redux/actions";

const Order = () => {
  const [state, setState] = useState({
    search: "",
    activeIndex: null,
  });
  const token = useSelector((state) => state.auth.token);
  const order = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchOrder(token));
  }, [token, dispatch]);

  const onCollapseHandle = (id) => {
    if (state.activeIndex === id) {
      setState({ ...state, activeIndex: null });
    } else {
      setState({ ...state, activeIndex: id });
    }
  };

  const orders = [];
  order.orders.forEach((order, index) => {
    if (order.name.toUpperCase().indexOf(state.search.toUpperCase()) === -1) {
      return;
    }

    orders.push(
      <div
        key={index}
        className="flex flex-col overflow-hidden border rounded-lg mb-4"
      >
        <div
          className={
            "flex items-center " +
            (state.activeIndex === order.id
              ? "text-white bg-indigo-700"
              : "text-gray-800") +
            " p-4"
          }
        >
          <div className="w-3/12 text-sm font-medium">
            <span
              className={
                "text-xs " +
                (state.activeIndex === order.id
                  ? "text-indigo-100"
                  : "text-gray-800")
              }
            >
              behalf of the:
            </span>{" "}
            {order.name}
          </div>

          <div className="w-3/12 text-center text-sm font-medium">
            <span
              className={
                "text-xs " +
                (state.activeIndex === order.id
                  ? "text-indigo-100"
                  : "text-gray-800")
              }
            >
              total menu:
            </span>{" "}
            {order.order_details.length}
          </div>

          <div className="w-3/12 text-center text-sm font-medium">
            <span
              className={
                "text-xs " +
                (state.activeIndex === order.id
                  ? "text-indigo-100"
                  : "text-gray-800")
              }
            >
              cash:
            </span>{" "}
            Rp {order.cash},-
          </div>

          <div className="w-3/12 text-center text-sm font-medium">
            <span
              className={
                "text-xs " +
                (state.activeIndex === order.id
                  ? "text-indigo-100"
                  : "text-gray-800")
              }
            >
              pay:
            </span>{" "}
            Rp {order.sub_total + order.tax},-
          </div>

          <div className="w-3/12 flex items-center justify-center">
            <button
              className={
                (state.activeIndex === order.id
                  ? "bg-indigo-600 text-gray-300"
                  : "bg-gray-400 text-gray-500") + " rounded-lg p-1"
              }
              onClick={() => onCollapseHandle(order.id)}
            >
              {state.activeIndex === order.id ? (
                <ChevronDown size={18} />
              ) : (
                <Minus size={16} />
              )}
            </button>
          </div>
        </div>

        {state.activeIndex === order.id && (
          <div className="flex divide-x py-4">
            <div className="w-3/4 flex flex-col px-4">
              <div className="text-sm text-gray-500 font-medium">Menu list</div>
              {order.order_details.map((detail, index) => (
                <div
                  key={index}
                  className="flex text-sm text-gray-800 font-medium"
                >
                  <div className="w-1/2">
                    {detail.menu.name}({detail.quantity})
                  </div>
                  <div className="w-1/2 text-center">
                    Rp {detail.menu.price},-
                  </div>
                </div>
              ))}
            </div>

            <div className="w-1/4 flex flex-col items-end px-4">
              <div className="text-sm text-gray-500 font-medium">Total</div>

              <div className="text-sm text-gray-800 font-medium">
                Rp{" "}
                {order.order_details.reduce(
                  (total, detail) => total + detail.total,
                  0
                )}
                ,-
              </div>
            </div>
          </div>
        )}
      </div>
    );
  });

  return (
    <Main>
      <div className="flex-1 flex flex-col px-8">
        <div className="group flex items-center py-8">
          <Search className="text-gray-300 mr-2" size={20} />

          <input
            className="w-ful text-md text-gray-800 bg-transparent focus:outline-none"
            type="text"
            placeholder="Search..."
            value={state.search}
            onChange={(event) =>
              setState({ ...state, search: event.target.value })
            }
          />
        </div>

        <div className="flex items-center justify-center -mx-2 mb-4">
          <div className="flex-1 p-2">
            <div className="border border-indigo-700 rounded-md bg-indigo-700 p-4">
              <div className="text-2xl text-white font-semibold truncate">
                {order.orders.length}
              </div>

              <div className="text-sm text-white font-light truncate">
                Total order
              </div>
            </div>
          </div>

          <div className="flex-1 p-2">
            <div className="border border-indigo-700 rounded-md bg-indigo-700 p-4">
              <div className="text-2xl text-white font-semibold truncate">
                {order.orders.reduce(
                  (total, order) => total + order.order_details.length,
                  0
                )}
              </div>

              <div className="text-sm text-white font-light truncate">
                Total menu
              </div>
            </div>
          </div>

          <div className="flex-1 p-2">
            <div className="border border-indigo-700 rounded-md bg-indigo-700 p-4">
              <div className="text-2xl text-white font-semibold truncate">
                Rp{" "}
                {order.orders.reduce(
                  (total, order) => total + (order.sub_total + order.tax),
                  0
                )}
                ,-
              </div>

              <div className="text-sm text-white font-light truncate">
                Total order amount
              </div>
            </div>
          </div>
        </div>

        <h6 className="text-xl text-gray-800 font-bold mb-4">Order list</h6>

        <div className="flex-1 flex flex-col overflow-y-auto">{orders}</div>
      </div>
    </Main>
  );
};

export default Order;
