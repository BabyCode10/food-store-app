import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Search,
  CornerUpLeft,
  Plus,
  Edit2,
  Trash,
  ChevronDown,
} from "react-feather";

import * as actions from "../../../redux/actions";
import Main from "../../../layouts/main";
import { Modal } from "../../../components";

const schema = yup.object().shape({
  name: yup.string().required().max(255),
  description: yup.string().required(),
  url: yup.string().required().max(255),
  category_id: yup.string().required(),
  price: yup.number().required().moreThan(0),
  stock: yup.boolean().required(),
});

const SettingMenu = () => {
  const [state, setState] = useState({
    search: "",
    categories: [],
    menus: [],
    menu: null,
    show: false,
    delete: false,
  });
  const token = useSelector((state) => state.auth.token);
  const menu = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  let { register, handleSubmit, reset, errors } = useForm({
    resolver: yupResolver(schema),
  });
  let { handleSubmit: handleDelete } = useForm();
  let history = useHistory();

  useEffect(() => {
    const fetchMenu = async () => {
      dispatch(actions.fetchMenuRequest());

      try {
        const menus = await axios.get("/menu", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(actions.fetchMenuSuccess(menus.data));
      } catch (error) {
        dispatch(actions.fetchMenuFailure());
      }
    };

    fetchMenu();
  }, [token, dispatch]);

  const menus = [];
  menu.menus.forEach((menu, index) => {
    if (menu.name.toUpperCase().indexOf(state.search.toUpperCase()) === -1) {
      return;
    }

    menus.push(
      <tr key={index}>
        <td className="border text-gray-800 text-sm text-center font-medium py-3">
          {index + 1}.
        </td>
        <td className="border text-gray-800 text-sm font-medium px-4 py-3">
          {menu.name} <br />{" "}
          <span className="text-indigo-800">{menu.category.name}</span>
        </td>
        <td className="border text-gray-800 text-sm text-center font-medium px-4 py-3">
          Rp {menu.price},-
        </td>
        <td className="border text-gray-800 text-sm text-center font-medium px-4 py-3">
          {menu.stock ? "Ready" : "Not Ready"}
        </td>
        <td className="border text-gray-800 text-sm text-center font-medium px-4 py-3">
          <div className="flex items-center justify-center">
            <button
              className="bg-gray-300 rounded-full p-2 mr-2"
              onClick={() => onShowMenu(menu.id)}
            >
              <Edit2 className="text-gray-800" size={20} />
            </button>

            <button
              className="bg-gray-300 rounded-full p-2 mr-2"
              onClick={() => onDeleteMenu(menu.id)}
            >
              <Trash className="text-gray-800" size={20} />
            </button>
          </div>
        </td>
      </tr>
    );
  });

  const onSubmit = async (data) => {
    if (!state.menu) {
      dispatch(actions.addMenuRequest());

      try {
        const menu = await axios.post("/menu", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(actions.addMenuSuccess(menu.data));

        setState({ ...state, show: !state.show });
      } catch (error) {
        dispatch(actions.addMenuFailure());
      }
    } else {
      dispatch(actions.editMenuRequest());

      try {
        const menu = await axios.put(`/menu/${state.menu.id}`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(actions.editMenuSuccess(menu.data));

        setState({ ...state, menu: null, show: !state.show });
      } catch (error) {
        dispatch(actions.editMenuFailure());
      }
    }

    reset();
  };

  const onDelete = async () => {
    dispatch(actions.deleteMenuRequest());

    try {
      await axios.delete(`/menu/${state.menu.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(actions.deleteMenuSuccess(state.menu));

      setState({ ...state, category: null, delete: !state.delete });
    } catch (error) {
      dispatch(actions.deleteMenuFailure());
    }
  };

  const getCategories = async () => {
    const categories = await axios.get("/category", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return categories;
  };

  const onCreateMenu = async () => {
    const categories = await getCategories();

    setState({
      ...state,
      menu: null,
      categories: categories.data,
      show: !state.show,
    });
  };

  const onShowMenu = async (id) => {
    const menu = await axios.get(`/menu/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const categories = await getCategories();

    setState({
      ...state,
      menu: menu.data,
      categories: categories.data,
      show: !state.show,
    });
  };

  const onDeleteMenu = async (id) => {
    const menu = await axios.get(`/menu/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setState({ ...state, menu: menu.data, delete: !state.delete });
  };

  return (
    <Main>
      <div className="flex-1 flex flex-col px-8">
        <div className="group flex items-center py-8">
          <Search className="text-gray-300 mr-2" size={20} />

          <input
            className="text-md text-gray-800 w-full bg-transparent focus:outline-none"
            type="text"
            placeholder="Search..."
          />
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              className="bg-gray-300 rounded-full p-2 mr-4"
              onClick={() => history.goBack()}
            >
              <CornerUpLeft className="text-gray-800" size={20} />
            </button>

            <h6 className="text-xl text-gray-800 font-bold">Menu</h6>
          </div>

          <button
            className="bg-gray-300 rounded-full p-2 mr-2"
            onClick={() => onCreateMenu()}
          >
            <Plus className="text-gray-800" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
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
                  Price
                </th>
                <th className="border text-gray-800 text-md font-semibold px-4 py-3">
                  Stock
                </th>
                <th className="border text-gray-800 text-md font-semibold px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {menus.length > 0 ? (
                menus
              ) : (
                <tr>
                  <td
                    className="border text-gray-800 text-sm text-center font-medium py-3"
                    colSpan={5}
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
        onShow={() => setState({ ...state, show: !state.show })}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-xl text-gray-800 mb-4">
            {state.menu ? "Edit menu" : "Add menu"}
          </div>

          <div className="mb-8">
            <div className="flex flex-col mb-4">
              <input
                className="w-full text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                name="name"
                type="text"
                placeholder="Name"
                defaultValue={state.menu && state.menu.name}
                ref={register}
              />

              {errors.name && (
                <span className="text-sm text-red-400 text-center">
                  {errors.name?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <textarea
                className="w-full text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                name="description"
                placeholder="Description"
                ref={register}
              >
                {state.menu && state.menu.description}
              </textarea>

              {errors.description && (
                <span className="text-sm text-red-400 text-center">
                  {errors.description?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <input
                className="w-full text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                name="url"
                type="text"
                placeholder="Url Image"
                defaultValue={state.menu && state.menu.url}
                ref={register}
              />

              {errors.url && (
                <span className="text-sm text-red-400 text-center">
                  {errors.url?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <div className="relative">
                <select
                  className="w-full appearance-none text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline:none p-3"
                  name="category_id"
                  defaultValue={state.menu && state.menu.category.id}
                  ref={register}
                >
                  <option value="">Select category</option>
                  {state.categories.map((category, index) => (
                    <option key={index} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                  <ChevronDown className="text-gray-800" size={20} />
                </div>
              </div>

              {errors.category_id && (
                <span className="text-sm text-red-400 text-center">
                  {errors.category_id?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <input
                className="w-full text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                name="price"
                type="text"
                placeholder="Price"
                defaultValue={state.menu ? state.menu.price : ""}
                ref={register}
              />

              {errors.price && (
                <span className="text-sm text-red-400 text-center">
                  {errors.price?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <div className="flex items-center justify-center">
                <div className="mr-8">
                  <input
                    className="mr-4"
                    name="stock"
                    type="radio"
                    value="true"
                    defaultChecked={state.menu && state.menu.stock === 1}
                    ref={register}
                  />{" "}
                  <label className="text-sm text-gray-800 font-medium">
                    Ready
                  </label>
                </div>

                <div className="mr-8">
                  <input
                    className="mr-4"
                    name="stock"
                    type="radio"
                    value="false"
                    defaultChecked={state.menu && state.menu.stock === 0}
                    ref={register}
                  />{" "}
                  <label className="text-sm text-gray-800 font-medium">
                    Not Ready
                  </label>
                </div>
              </div>

              {errors.stock && (
                <span className="text-sm text-red-400 text-center">
                  {errors.stock?.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              className="text-sm text-gray-800 px-8 py-2"
              onClick={() =>
                setState({ ...state, menu: null, show: !state.show })
              }
            >
              Cancel
            </button>

            <button
              className="text-sm text-white bg-indigo-700 rounded-lg px-8 py-2"
              type="submit"
            >
              {state.menu ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        show={state.delete}
        onShow={() => setState({ ...state, menu: null, delete: !state.delete })}
      >
        <div className="flex mb-8">
          <div className="mr-4">
            <div className="bg-red-400 rounded-full p-2">
              <Trash className="text-red-700" size={20} />
            </div>

            <div>
              <h6 className="text-xl text-gray-800 mb-2">Delete menu</h6>

              <p className="text-sm text-gray-600">
                Are you sure you want to delete menu? All of your data will be
                permanently deleted. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button className="text-sm text-gray-800 px-8 py-2">Cancel</button>

            <form onSubmit={handleDelete(onDelete)}>
              <button
                className="text-sm text-white bg-red-700 rounded-lg px-8 py-2"
                type="submit"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </Main>
  );
};

export default SettingMenu;
