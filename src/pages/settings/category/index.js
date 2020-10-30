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
});

const SettingCategory = () => {
  const [state, setState] = useState({
    search: "",
    category: null,
    show: false,
    delete: false,
    flash: {
      message: null,
      type: null,
    },
  });
  const token = useSelector((state) => state.auth.token);
  const category = useSelector((state) => state.category);
  const dispatch = useDispatch();
  let { register, handleSubmit, reset, errors } = useForm({
    resolver: yupResolver(schema),
  });
  let { handleSubmit: handleDelete } = useForm();
  let history = useHistory();

  useEffect(() => {
    const fetchCategory = async () => {
      dispatch(actions.fetchCategoryRequest());

      try {
        const categories = await axios.get("/category", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(actions.fetchCategorySuccess(categories.data));
      } catch (error) {
        dispatch(actions.fetchCategoryFailure());
      }
    };

    fetchCategory();
  }, [token, dispatch]);

  const categories = [];
  category.categories.forEach((category, index) => {
    if (
      category.name.toUpperCase().indexOf(state.search.toUpperCase()) === -1
    ) {
      return;
    }

    categories.push(
      <tr key={index}>
        <td className="border text-gray-800 text-sm text-center font-medium py-3">
          {index + 1}.
        </td>
        <td className="border text-gray-800 text-sm font-medium px-4 py-3">
          {category.name} <br />{" "}
          <span className="text-indigo-800">{category.slug}</span>
        </td>
        <td className="border text-gray-800 px-4 py-3">
          <div className="flex items-center justify-center">
            <button
              className="bg-gray-300 rounded-full p-2 mr-2"
              onClick={() => onShowCategory(category.id)}
            >
              <Edit2 className="text-gray-800" size={20} />
            </button>

            <button
              className="bg-gray-300 rounded-full p-2 mr-2"
              onClick={() => onDeleteCategory(category.id)}
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

    if (!state.category) {
      dispatch(actions.addCategoryRequest());

      try {
        const category = await axios.post("/category", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(actions.addCategorySuccess(category.data));

        setState({
          ...state,
          show: !state.show,
          flash: {
            ...state.flash,
            message: "Created category succesful.",
            type: "success",
          },
        });
      } catch (error) {
        dispatch(actions.addCategoryFailure());
      }
    } else {
      dispatch(actions.editCategoryRequest());

      try {
        const category = await axios.put(
          `/category/${state.category.id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        dispatch(actions.editCategorySuccess(category.data));

        setState({
          ...state,
          category: null,
          show: !state.show,
          flash: {
            ...state.flash,
            message: "Updated category succesful.",
            type: null,
          },
        });
      } catch (error) {
        dispatch(actions.editCategoryFailure());
      }
    }

    reset();
  };

  const onDelete = async () => {
    dispatch(actions.deleteCategoryRequest());

    try {
      await axios.delete(`/category/${state.category.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(actions.deleteCategorySuccess(state.category));

      setState({
        ...state,
        category: null,
        delete: !state.delete,
        flash: {
          ...state.flash,
          message: "Deleted menu succesful.",
          type: "alert",
        },
      });
    } catch (error) {
      dispatch(actions.deleteCategoryFailure());
    }
  };

  const onShowCategory = async (id) => {
    const category = await axios.get(`/category/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setState({ ...state, category: category.data, show: !state.show });
  };

  const onDeleteCategory = async (id) => {
    const category = await axios.get(`/category/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setState({ ...state, category: category.data, delete: !state.delete });
  };

  return (
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

            <h6 className="text-xl text-gray-800 font-bold">Category</h6>
          </div>

          <button
            className="bg-gray-300 rounded-full p-2 mr-2"
            onClick={() => setState({ ...state, show: !state.show })}
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
              {categories.length > 0 ? (
                categories
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
        onShow={() => setState({ ...state, show: !state.show })}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-xl text-gray-800 mb-4">
            {state.category ? "Edit category" : "Add category"}
          </div>

          <div className="mb-8">
            <div className="flex flex-col mb-4">
              <input
                className="w-full text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                name="name"
                type="text"
                placeholder="Name"
                defaultValue={state.category ? state.category.name : ""}
                ref={register}
              />

              {errors.name && (
                <span className="text-sm text-red-400 text-center">
                  {errors.name?.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              className="text-sm text-gray-800 rounded-lg px-8 py-2"
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
              {state.category ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        show={state.delete}
        onShow={() =>
          setState({ ...state, category: null, delete: !state.delete })
        }
      >
        <div className="flex mb-8">
          <div className="mr-4">
            <div className="bg-red-400 rounded-full p-2">
              <Trash className="text-red-700" size={20} />
            </div>
          </div>

          <div>
            <h6 className="text-xl text-gray-800 mb-2">Delete category</h6>

            <p className="text-sm text-gray-600">
              Are you sure you want to delete category? All of your data will be
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
  );
};

export default SettingCategory;
