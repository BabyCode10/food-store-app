import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import FlashMessage from "react-flash-message";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Search, CornerUpLeft, Plus, Edit2, Trash } from "react-feather";

import * as actions from "../../../redux/actions";
import Main from "../../../layouts/main";
import { Modal, Message } from "../../../components";

const schema = yup.object().shape({
  name: yup.string().required().max(255),
  email: yup.string().required().max(255).email(),
  password: yup.string().required().min(4).max(255),
  password_confirmation: yup
    .string()
    .required()
    .min(4)
    .max(255)
    .oneOf([yup.ref("password"), null], " Password must match"),
});

const SettingUser = () => {
  const [state, setState] = useState({
    search: "",
    user: null,
    show: false,
    delete: false,
    flash: {
      message: null,
      type: null,
    },
  });
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let { register, handleSubmit, reset, errors } = useForm({
    resolver: yupResolver(schema),
  });
  let { handleSubmit: handleDelete } = useForm();
  let history = useHistory();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(actions.fetchUserRequest());

      try {
        const users = await axios.get("/user", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(actions.fetchUserSuccess(users.data));
      } catch (error) {
        dispatch(actions.fetchUserFailure());
      }
    };

    fetchUser();
  }, [token, dispatch]);

  const users = [];
  user.users.forEach((user, index) => {
    if (user.name.toUpperCase().indexOf(state.search.toUpperCase()) === -1) {
      return;
    }

    users.push(
      <tr key={index}>
        <td className="border text-gray-800 text-sm text-center font-medium py-3">
          {index + 1}.
        </td>
        <td className="border text-gray-800 text-sm font-medium px-4 py-3">
          {user.name} <br />{" "}
          <span className="text-indigo-800">{user.email}</span>
        </td>
        <td className="border text-gray-800 px-4 py-3">
          <div className="flex items-center justify-center">
            <button
              className="bg-gray-300 rounded-full p-2 mr-2"
              onClick={() => onShowUser(user.id)}
            >
              <Edit2 className="text-gray-800" size={20} />
            </button>

            <button
              className="bg-gray-300 rounded-full p-2 mr-2"
              onClick={() => onDeleteUser(user.id)}
            >
              <Trash className="text-gray-800" size={20} />
            </button>
          </div>
        </td>
      </tr>
    );
  });

  const onSubmit = async (data) => {
    setState({
      ...state,
      flash: {
        ...state.flash,
        message: null,
        type: null,
      },
    });

    if (!state.user) {
      try {
        dispatch(actions.addUserRequest());

        const user = await axios.post("/user", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(actions.addUserSuccess(user.data));

        setState({
          ...state,
          show: !state.show,
          flash: {
            ...state.flash,
            message: "Created user succesful.",
            type: "success",
          },
        });
      } catch (error) {
        dispatch(actions.addUserFailure());
      }
    } else {
      try {
        dispatch(actions.editUserRequest());

        const user = await axios.put(`/user/${state.user.id}`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(actions.editUserSuccess(user.data));

        setState({
          ...state,
          show: !state.show,
          flash: {
            ...state.flash,
            message: "Updated user succesful.",
            type: null,
          },
        });
      } catch (error) {
        dispatch(actions.editUserFailure());
      }
    }

    reset();
  };

  const onDelete = async () => {
    setState({
      ...state,
      flash: {
        ...state.flash,
        message: null,
        type: null,
      },
    });

    try {
      dispatch(actions.deleteUserRequest());

      await axios.delete(`/user/${state.user.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(actions.deleteUserSuccess(state.user));

      setState({
        ...state,
        delete: !state.delete,
        flash: {
          ...state.flash,
          message: "Deleted user succesful.",
          type: "alert",
        },
      });
    } catch (error) {
      dispatch(actions.deleteUserFailure());
    }
  };

  const onShowUser = async (id) => {
    const user = await axios.get(`/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setState({ ...state, user: user.data, show: !state.show });
  };

  const onDeleteUser = async (id) => {
    const user = await axios.get(`/user/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setState({ ...state, user: user.data, delete: !state.show });
  };

  return (
    token && (
      <Main>
        <div className="flex-1 flex flex-col">
          {state.flash.message && (
            <FlashMessage duration={3000} persistOnHover={true}>
              <Message type={state.flash.type}>{state.flash.message}</Message>
            </FlashMessage>
          )}

          <div className="group flex items-center p-8">
            <Search className="text-gray-300 mr-2" size={20} />

            <input
              className="text-md text-gray-800 w-full bg-transparent focus:outline-none"
              type="text"
              placeholder="Search..."
              onChange={(event) =>
                setState({ ...state, search: event.target.value })
              }
              value={state.search}
            />
          </div>

          <div className="flex items-center justify-between px-8 mb-8">
            <div className="flex items-center">
              <button
                className="bg-gray-300 rounded-full p-2 mr-4"
                onClick={() => history.goBack()}
              >
                <CornerUpLeft className="text-gray-800" size={20} />
              </button>

              <h6 className="text-xl text-gray-800 font-bold">User</h6>
            </div>

            <button
              className="bg-gray-300 rounded-full p-2 mr-2"
              onClick={() =>
                setState({ ...state, user: null, show: !state.show })
              }
            >
              <Plus className="text-gray-800" size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border text-gray-800 text-md font-semibold py-3">
                    No
                  </th>
                  <th className="border text-left text-gray-800 text-md font-semibold px-4 py-3">
                    Name
                  </th>
                  <th className="border text-gray-800 text-md font-semibold px-4 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users
                ) : (
                  <tr>
                    <td
                      className="border text-gray-800 text-sm text-center font-medium py-3"
                      colSpan={3}
                    >
                      No Data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal
          show={state.show}
          onShow={() => setState({ ...state, user: null, show: !state.show })}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-xl text-gray-800 mb-4">
              {state.user ? "Edit user" : "Add user"}
            </div>

            <div className="mb-8">
              <div className="flex flex-col mb-4">
                <input
                  className="w-full text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                  name="name"
                  type="text"
                  placeholder="Name"
                  defaultValue={state.user ? state.user.name : ""}
                  ref={register}
                />

                {errors.name && (
                  <span className="text-sm text-red-400 text-center">
                    {errors.name?.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col mb-4">
                <input
                  className="w-full text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                  name="email"
                  type="text"
                  placeholder="Email Address"
                  defaultValue={state.user ? state.user.email : ""}
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
                  className="w-full text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
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

              <div className="flex flex-col mb-4">
                <input
                  className="w-full text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                  name="password_confirmation"
                  type="password"
                  placeholder="Retype Password"
                  ref={register}
                />

                {errors.password_confirmation && (
                  <span className="text-sm text-red-400 text-center">
                    {errors.password_confirmation?.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                className="text-sm text-gray-800 px-8 py-2"
                onClick={() =>
                  setState({ ...state, user: null, show: !state.show })
                }
              >
                Cancel
              </button>

              <button
                className="text-sm text-white bg-indigo-700 rounded-lg px-8 py-2"
                type="submit"
              >
                {state.user ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          show={state.delete}
          onShow={() =>
            setState({ ...state, user: null, delete: !state.delete })
          }
        >
          <div className="flex mb-8">
            <div className="mr-4">
              <div className="bg-red-400 rounded-full p-2">
                <Trash className="text-red-700" size={20} />
              </div>
            </div>

            <div>
              <h6 className="text-xl text-gray-800 mb-2">Delete user</h6>

              <p className="text-sm text-gray-600">
                Are you sure you want to delete user? All of your data will be
                permanently deleted. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              className="text-sm text-gray-800 font-medium px-8 py-2 mr-4"
              onClick={() =>
                setState({ ...state, user: null, delete: !state.delete })
              }
            >
              Cancel
            </button>

            <form onSubmit={handleDelete(onDelete)}>
              <button
                className="text-sm text-white bg-red-700 rounded-lg px-8 py-2"
                type="submit"
              >
                Delete
              </button>
            </form>
          </div>
        </Modal>
      </Main>
    )
  );
};

export default SettingUser;
