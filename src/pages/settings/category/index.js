import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Search, CornerUpLeft, Plus, Edit2, Trash } from "react-feather";
import { useTransition } from "react-spring";
import { useTable } from "react-table";

import * as actions from "../../../redux/actions";
import Main from "../../../layouts/main";
import { Modal, Message } from "../../../components";

const schema = yup.object().shape({
  name: yup.string().required().max(255),
});

const SettingCategory = () => {
  const [flash, setFlash] = useState({
    message: null,
    type: null,
  });
  const [state, setState] = useState({
    search: "",
    category: null,
    add: false,
    edit: false,
    delete: false,
  });
  const token = useSelector((state) => state.auth.token);
  const category = useSelector((state) => state.category);
  const dispatch = useDispatch();
  let { register, handleSubmit, reset, errors } = useForm({
    resolver: yupResolver(schema),
  });
  let { handleSubmit: handleDelete } = useForm();
  let history = useHistory();
  const configTransition = {
    config: { mass: 1, tension: 500, friction: 50 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  };
  const transitionsAdd = useTransition(state.add, null, configTransition);
  const transitionsEdit = useTransition(state.edit, null, configTransition);
  const transitionsDelete = useTransition(state.delete, null, configTransition);

  useEffect(() => {
    const fetchCategory = async () => {
      dispatch(actions.fetchCategoryRequest());

      try {
        const response = await axios.get("/category", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(actions.fetchCategorySuccess(response.data));
      } catch (error) {
        dispatch(actions.fetchCategoryFailure());
      }
    };

    fetchCategory();
  }, [token, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFlash({ ...flash, message: null });
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [flash]);

  const onSearch = (event) => {
    if (event.key === "Enter") {
      const searchCategory = async () => {
        dispatch(actions.searchCategoryRequest());

        try {
          const response = await axios.get("/category/search", {
            params: {
              search: event.target.value,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          dispatch(actions.searchCategorySuccess(response.data));
        } catch (error) {
          dispatch(actions.searchCategoryFailure());
        }
      };

      searchCategory();
    }
  };

  const onSubmitAdd = async (data) => {
    dispatch(actions.addCategoryRequest());

    try {
      const response = await axios.post("/category", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(actions.addCategorySuccess(response.data));

      setFlash({
        ...flash,
        message: "Created category succesful.",
        type: "success",
      });

      setState({
        ...state,
        add: false,
      });
    } catch (error) {
      dispatch(actions.addCategoryFailure());
    }

    reset();
  };

  const onSubmitEdit = async (data) => {
    dispatch(actions.editCategoryRequest());

    try {
      const response = await axios.put(`/category/${state.category.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(actions.editCategorySuccess(response.data));

      setFlash({
        ...flash,
        message: "Updated category succesful.",
        type: null,
      });

      setState({
        ...state,
        edit: false,
      });
    } catch (error) {
      dispatch(actions.editCategoryFailure());
    }

    reset();
  };

  const onSubmitDelete = async () => {
    dispatch(actions.deleteCategoryRequest());

    try {
      await axios.delete(`/category/${state.category.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(actions.deleteCategorySuccess(state.category));

      setFlash({
        ...flash,
        message: "Deleted menu succesful.",
        type: "alert",
      });

      setState({
        ...state,
        delete: false,
      });
    } catch (error) {
      dispatch(actions.deleteCategoryFailure());
    }
  };

  const data = useMemo(() => category.categories, [category.categories]);

  const columns = useMemo(
    () => [
      {
        Header: "No",
        accessor: "no",
        className: "w-16 border text-gray-800 text-md font-semibold px-4 py-3",
        align: "text-center",
        Cell: (row) => row.row.index + 1,
      },
      {
        Header: "Name",
        accessor: "name",
        className:
          "border text-gray-800 text-md text-left font-semibold px-4 py-3",
        align: "text-left",
        Cell: (row) => (
          <>
            {row.row.original.name} <br />{" "}
            <span className="text-indigo-800">{row.row.original.slug}</span>
          </>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        className: "w-24 border text-gray-800 text-md font-semibold px-4 py-3",
        Cell: (row) => {
          const getCategory = async (id) => {
            const response = await axios.get(`/category/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            return response;
          };
          
          const onShowCategory = (id) => {
            const response = getCategory(id);

            setState({ ...state, category: response.data, edit: true });
          };

          const onDeleteCategory = (id) => {
            const response = getCategory(id);

            setState({ ...state, category: response.data, delete: true });
          };

          return (
            <div className="flex items-center justify-center">
              <button
                className="bg-gray-300 rounded-full focus:outline-none p-2 mr-2"
                onClick={() => onShowCategory(row.row.original.id)}
              >
                <Edit2 className="text-gray-800" size={20} />
              </button>

              <button
                className="bg-gray-300 rounded-full focus:outline-none p-2"
                onClick={() => onDeleteCategory(row.row.original.id)}
              >
                <Trash className="text-gray-800" size={20} />
              </button>
            </div>
          );
        },
      },
    ],
    [state, token]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <Main>
      <div className="relative flex-1 flex flex-col">
        <Message show={flash?.message} type={flash?.type}>
          {flash?.message}
        </Message>

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
            onKeyDown={onSearch}
          />
        </div>

        <div className="flex items-center justify-between px-8 mb-8">
          <div className="flex items-center">
            <button
              className="bg-gray-300 rounded-full focus:outline-none p-2 mr-4"
              onClick={() => history.goBack()}
            >
              <CornerUpLeft className="text-gray-800" size={20} />
            </button>

            <h6 className="text-xl text-gray-800 font-bold">Category</h6>
          </div>

          <button
            className="bg-gray-300 rounded-full focus:outline-none p-2 mr-2"
            onClick={() => setState({ ...state, category: null, add: true })}
          >
            <Plus className="text-gray-800" size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8">
          <table {...getTableProps()} className="w-full table-auto">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-gray-200"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className={column.className}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className={`border text-gray-800 text-sm ${cell.column.align} font-medium px-4 py-3`}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {transitionsAdd.map(
        ({ item, key, props: style }) =>
          item && (
            <Modal
              key={key}
              style={style}
              show={state.add}
              onShow={() => setState({ ...state, add: false })}
            >
              <form onSubmit={handleSubmit(onSubmitAdd)}>
                <div className="text-xl text-gray-800 mb-4">Add category</div>

                <div className="mb-8">
                  <div className="flex flex-col mb-4">
                    <input
                      className="w-full text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                      name="name"
                      type="text"
                      placeholder="Name"
                      defaultValue=""
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
                    className="text-sm text-white bg-indigo-700 rounded-lg px-8 focus:outline-none py-2"
                    type="submit"
                  >
                    Save
                  </button>

                  <button
                    className="text-sm text-gray-800 rounded-lg focus:outline-none px-8 py-2"
                    onClick={(event) => {
                      event.preventDefault();

                      setState({ ...state, add: false });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Modal>
          )
      )}

      {transitionsEdit.map(
        ({ item, key, props: style }) =>
          item && (
            <Modal
              key={key}
              style={style}
              show={state.edit}
              onShow={() => setState({ ...state, edit: false })}
            >
              <form onSubmit={handleSubmit(onSubmitEdit)}>
                <div className="text-xl text-gray-800 mb-4">Edit category</div>

                <div className="mb-8">
                  <div className="flex flex-col mb-4">
                    <input
                      className="w-full text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                      name="name"
                      type="text"
                      placeholder="Name"
                      defaultValue={state.category?.name}
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
                    className="text-sm text-white bg-indigo-700 rounded-lg focus:outline-none px-8 py-2"
                    type="submit"
                  >
                    Update
                  </button>

                  <button
                    className="text-sm text-gray-800 rounded-lg focus:outline-none px-8 py-2"
                    onClick={(event) => {
                      event.preventDefault();

                      setState({ ...state, edit: false });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Modal>
          )
      )}

      {transitionsDelete.map(
        ({ item, key, props: style }) =>
          item && (
            <Modal
              key={key}
              style={style}
              show={state.delete}
              onShow={() => setState({ ...state, delete: false })}
            >
              <div className="flex mb-8">
                <div className="mr-4">
                  <div className="bg-red-400 rounded-full p-2">
                    <Trash className="text-red-700" size={20} />
                  </div>
                </div>

                <div>
                  <h6 className="text-xl text-gray-800 mb-2">
                    Delete category
                  </h6>

                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete category? All of your data
                    will be permanently deleted. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  className="text-sm text-gray-800 font-medium focus:outline-none px-8 py-2 mr-4"
                  onClick={() => setState({ ...state, delete: false })}
                >
                  Cancel
                </button>

                <form onSubmit={handleDelete(onSubmitDelete)}>
                  <button
                    className="text-sm text-white bg-red-700 rounded-lg focus:outline-none px-8 py-2"
                    type="submit"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </Modal>
          )
      )}
    </Main>
  );
};

export default SettingCategory;
