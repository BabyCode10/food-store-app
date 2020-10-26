import React from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import FoodImage from "../../../assets/images/food.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as actions from "../../../redux/actions";
import axios from "axios";

const schema = yup.object().shape({
  email: yup.string().required().max(255).email(),
  password: yup.string().required().min(4).max(255),
});

const Login = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, setError } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    dispatch(actions.loginRequest());

    try {
      const user = await axios.post("/login", data, {
        headers: { "Content-Type": "application/json" },
      });

      dispatch(actions.loginSuccess(user.data));
    } catch (error) {
      dispatch(actions.loginFailure(error.response.data.errors));

      setError("email", {
        type: "server",
        message: error.response.data.errors.email[0],
      });
    }
  };

  return (
    <div className="h-screen min-h-screen flex bg-gray-100">
      <div className="w-1/3 flex flex-col items-center justify-center">
        <h6 className="text-xl text-gray-800 font-bold mb-8">
          Welcome to <span className="text-indigo-800">FoodStore</span>
        </h6>

        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mb-4">
            <input
              className="text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
              name="email"
              type="text"
              placeholder="Email Address"
              ref={register}
            />

            {errors.email && (
              <span className="text-sm text-red-400 text-center">
                {errors.email?.message}
              </span>
            )}
          </div>

          <div className="flex flex-col mb-4">
            <input
              className="text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
              name="password"
              type="password"
              placeholder="Password"
              ref={register}
            />

            {errors.password && (
              <span className="text-sm text-red-400 text-center">
                {errors.password?.message}
              </span>
            )}
          </div>

          <button
            className="text-md text-white font-semibold bg-indigo-700 rounded-lg py-2"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>

      <div className="flex-1 flex flex-col items-start justify-center bg-indigo-100 p-16">
        <img className="w-2/3 mb-4" src={FoodImage} alt="Login" />

        <h5 className="text-2xl text-gray-800 font-bold">
          <span className="text-indigo-800">FoodStore</span> easy way to order
          food.
        </h5>
      </div>
    </div>
  );
};

export default Login;
