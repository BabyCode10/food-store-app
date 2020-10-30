import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import NumberFormat from "react-number-format";
import axios from "axios";
import { Check, ChevronRight } from "react-feather";
import * as actions from "../../redux/actions";

const schema = yup.object().shape({
  name: yup.string().required().max(255),
});

const Payment = () => {
  const [state, setState] = useState({
    cash: "",
    splash: false,
  });
  const history = useHistory();
  const cart = useSelector((state) => state.cart);
  const token = useSelector((state) => state.auth.token);
  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  const details = [];
  cart.menus.forEach((menu, index) => {
    details.push(
      <div
        key={index}
        className="bg-gray-100 flex items-center justify-between border rounded-md px-3 py-2 mb-3"
      >
        <div className="flex-1 flex items-center">
          <div className="min-w-10 h-10 w-10 flex items-center justify-center overflow-hidden bg-gray-400 rounded-lg mr-2">
            <img
              className="object-cover w-full text-gray-800 text-xs text-center font-medium truncate"
              src={menu.url}
              alt={menu.name}
            />
          </div>

          <p className="text-sm text-gray-800 font-semibold truncate">
            {menu.name}
          </p>
        </div>

        <div className="flex-1 text-sm text-gray-600 text-center font-semibold">
          {menu.quantity}x
        </div>

        <div className="flex-1 text-sm text-gray-600 text-right font-semibold">
          <NumberFormat
            value={menu.price * menu.quantity}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"Rp "}
            renderText={(value) => <span>{value}</span>}
          />
        </div>
      </div>
    );
  });

  const onSubmit = async (data) => {
    if (state.cash < cart.subTotal + cart.tax) {
      setError("cash", {
        type: "manual",
        message: "cash is not enough",
      });
    } else {
      dispatch(actions.addOrderRequest());

      try {
        data.cash = state.cash;
        data.sub_total = cart.subTotal;
        data.tax = cart.tax;
        data.details = cart.menus;

        const order = await axios.post("/order", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(actions.addOrderSuccess(order.data));
        dispatch(actions.resetCart());

        setState({ ...state, splash: true });
      } catch (error) {
        console.log(error);
        dispatch(actions.addOrderFailure());
      }
    }
  };

  return state.splash ? (
    <Splash />
  ) : (
    <div className="h-screen min-h-screen flex flex-col overflow-hidden bg-gray-100">
      <div className="bg-white border-b py-8">
        <div className="container mx-auto px-8">
          <div className="text-md text-gray-800 font-semibold">
            {process.env.REACT_APP_NAME}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden container mx-auto px-8 py-4">
        <div className="flex-1 overflow-hidden flex">
          <div className="w-4/6 flex flex-col pr-4">
            <div className="flex-1 flex flex-col overflow-hidden border rounded-md bg-white p-6">
              <div className="text-md text-gray-800 font-semibold mb-4">
                Order
              </div>

              <form id="order" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col mb-4">
                  <input
                    className="text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                    name="name"
                    type="text"
                    placeholder="Behalf of the ..."
                    ref={register}
                  />

                  {errors.name && (
                    <span className="text-sm text-red-400 text-center">
                      {errors.name?.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col mb-4">
                  <NumberFormat
                    className="text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                    placeholder="Cash"
                    ref={register}
                    onChange={(event) =>
                      setState({
                        ...state,
                        cash: event.target.value
                          .replace("Rp", "")
                          .replace(",", ""),
                      })
                    }
                    value={state.cash}
                    thousandSeparator={true}
                    prefix={"Rp "}
                  />

                  {errors.cash && (
                    <span className="text-sm text-red-400 text-center">
                      {errors.cash?.message}
                    </span>
                  )}
                </div>
              </form>

              <div className="text-md text-gray-800 font-semibold mb-4">
                Details
              </div>

              <div className="flex-1 flex flex-col overflow-y-auto">
                {details.length > 0 ? (
                  details
                ) : (
                  <div className="text-sm text-gray-800 text-center">
                    Cart is empty
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-2/6">
            <div className="border rounded-md bg-white p-6">
              <div className="text-md text-gray-800 text-center font-semibold">
                Order Summary
              </div>

              <div className="divide-y-2 divide-dashed">
                <ul>
                  <li className="flex items-center justify-between text-md text-gray-800 font-semibold py-2">
                    Sub total{" "}
                    <NumberFormat
                      value={cart.subTotal}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rp "}
                      renderText={(value) => <span>{value}</span>}
                    />
                  </li>
                  <li className="flex items-center justify-between text-md text-gray-800 font-semibold py-2">
                    Tax{" "}
                    <NumberFormat
                      value={cart.tax}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rp "}
                      renderText={(value) => <span>{value}</span>}
                    />
                  </li>
                </ul>

                <div className="flex items-center justify-between text-md text-gray-800 font-semibold py-2">
                  Total{" "}
                  <NumberFormat
                    value={cart.subTotal + cart.tax}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp "}
                    renderText={(value) => <span>{value}</span>}
                  />
                </div>

                <ul>
                  <li className="flex items-center justify-between text-md text-gray-800 font-semibold py-2">
                    Cash{" "}
                    <NumberFormat
                      value={state.cash || 0}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rp "}
                      renderText={(value) => <span>{value}</span>}
                    />
                  </li>
                  <li className="flex items-center justify-between text-md text-gray-800 font-semibold py-2">
                    Return{" "}
                    <NumberFormat
                      value={
                        state.cash - cart.subTotal < 1
                          ? 0
                          : state.cash - cart.subTotal
                      }
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rp "}
                      renderText={(value) => <span>{value}</span>}
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t py-3">
        <div className="flex items-center justify-between container mx-auto px-8">
          <button
            className="text-md text-gray-800 font-semibold"
            onClick={() => history.goBack()}
          >
            Back
          </button>

          <button
            className="bg-indigo-700 text-md text-center text-white font-semibold rounded-lg py-2 px-8"
            form="order"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;

const Splash = () => {
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      history.push("/menu");
    }, 3000);
  }, [history]);

  return (
    <div className="h-screen min-h-screen flex flex-col items-center justify-center bg-indigo-500">
      <div className="bg-white rounded-full p-3 mb-4">
        <Check className="text-indigo-500" size={52} />
      </div>

      <h5 className="text-white text-2xl font-semibold mb-2">
        Payment is successful.
      </h5>

      <p className="text-white text-lg font-medium mb-8">
        thank you for ordering in our food store
      </p>

      <button
        className="flex items-center text-md font-semibold bg-white text-indigo-500 rounded-lg px-8 py-2"
        onClick={() => history.push("/menu")}
      >
        Back to main menu{" "}
        <span className="bg-indigo-500 rounded-md p-1 ml-3">
          <ChevronRight className="text-white" size={12} />
        </span>
      </button>
    </div>
  );
};
