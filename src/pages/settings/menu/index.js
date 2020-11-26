import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import NumberFormat from "react-number-format";
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
import { useTransition } from "react-spring";
import { useTable } from "react-table";

import * as actions from "../../../redux/actions";
import Main from "../../../layouts/main";
import { Modal, Message } from "../../../components";

const schema = yup.object().shape({
  name: yup.string().required().max(255),
  description: yup.string().required(),
  url: yup.string().max(255),
  category_id: yup.string().required(),
  price: yup.string().required(),
  stock: yup.boolean().required(),
});

const SettingMenu = () => {
  const [flash, setFlash] = useState({
    message: null,
    type: null,
  });
  const [state, setState] = useState({
    search: "",
    price: null,
    categories: [],
    menu: null,
    add: false,
    edit: false,
    delete: false,
  });
  const token = useSelector((state) => state.auth.token);
  const menu = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  let { register, handleSubmit, reset, errors, setError } = useForm({
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
    const fetchMenu = async () => {
      dispatch(actions.fetchMenuRequest());

      try {
        const response = await axios.get("/menu", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(actions.fetchMenuSuccess(response.data));
      } catch (error) {
        dispatch(actions.fetchMenuFailure());
      }
    };

    fetchMenu();
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
      const searchMenu = async () => {
        dispatch(actions.searchMenuRequest());

        try {
          const response = await axios.get("/menu/search", {
            params: {
              search: event.target.value,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          console.log(response.data);

          dispatch(actions.searchMenuSuccess(response.data));
        } catch (error) {
          dispatch(actions.searchMenuFailure());
        }
      };

      searchMenu();
    }
  };

  const onSubmitAdd = async (data) => {
    if (state.price < 1) {
      setError("price", {
        type: "manual",
        message: "price must be more than 0",
      });
    } else {
      data.price = state.price;

      try {
        const response = await axios.post("/menu", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(actions.addMenuSuccess(response.data));

        setFlash({
          ...flash,
          message: "Created menu succesful.",
          type: "success",
        });

        setState({
          ...state,
          add: false,
        });
      } catch (error) {
        dispatch(actions.addMenuFailure());
      }
    }

    reset();
  };

  const onSubmitEdit = async (data) => {
    if (state.price < 1) {
      setError("price", {
        type: "manual",
        message: "price must be more than 0",
      });
    } else {
      data.price = state.price;

      dispatch(actions.editMenuRequest());

      try {
        const response = await axios.put(`/menu/${state.menu.id}`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(actions.editMenuSuccess(response.data));

        setFlash({
          ...flash,
          message: "Updated menu succesful.",
          type: null,
        });

        setState({
          ...state,
          edit: false,
        });
      } catch (error) {
        dispatch(actions.editMenuFailure());
      }
    }

    reset();
  };

  const onSubmitDelete = async () => {
    dispatch(actions.deleteMenuRequest());

    try {
      await axios.delete(`/menu/${state.menu.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(actions.deleteMenuSuccess(state.menu));

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
      dispatch(actions.deleteMenuFailure());
    }
  };

  const getCategories = async () => {
    const response = await axios.get("/category", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  const onAddMenu = async () => {
    const response = await getCategories();

    setState({
      ...state,
      categories: response.data,
      menu: null,
      add: true,
    });
  };

  const data = useMemo(() => menu.menus, [menu.menus]);

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
            <span className="text-indigo-800">
              {row.row.original.category.name}
            </span>
          </>
        ),
      },
      {
        Header: "Price",
        accessor: "price",
        className: "border text-gray-800 text-md font-semibold px-4 py-3",
        align: "text-center",
        Cell: (row) => (
          <>
            <NumberFormat
              value={row.row.original.price}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"Rp "}
              renderText={(value) => value}
            />
          </>
        ),
      },
      {
        Header: "Stock",
        accessor: "stock",
        className: "border text-gray-800 text-md font-semibold px-4 py-3",
        align: "text-center",
        Cell: (row) => <>{row.row.original.stock ? "Ready" : "Not Ready"}</>,
      },
      {
        Header: "Action",
        accessor: "action",
        className: "w-24 border text-gray-800 text-md font-semibold px-4 py-3",
        Cell: (row) => {
          const getMenu = async (id) => {
            const response = await axios.get(`/menu/${id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            return response;
          };

          const getCategories = async () => {
            const response = await axios.get("/category", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            return response;
          };

          const onShowMenu = async (id) => {
            const responseMenu = await getMenu(id);
            const responseCategory = await getCategories();

            setState({
              ...state,
              price: responseMenu.data.price,
              menu: responseMenu.data,
              categories: responseCategory.data,
              edit: true,
            });
          };

          const onDeleteMenu = async (id) => {
            const responseMenu = await getMenu(id);
            const responseCategory = await getCategories();

            setState({
              ...state,
              price: responseMenu.data.price,
              menu: responseMenu.data,
              categories: responseCategory.data,
              delete: true,
            });
          };

          return (
            <div className="flex items-center justify-center">
              <button
                className="bg-gray-300 rounded-full focus:outline-none p-2 mr-2"
                onClick={() => onShowMenu(row.row.original.id)}
              >
                <Edit2 className="text-gray-800" size={20} />
              </button>

              <button
                className="bg-gray-300 rounded-full focus:outline-none p-2"
                onClick={() => onDeleteMenu(row.row.original.id)}
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

            <h6 className="text-xl text-gray-800 font-bold">Menu</h6>
          </div>

          <button
            className="bg-gray-300 rounded-full focus:outline-none p-2 mr-2"
            onClick={() => onAddMenu()}
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
                <div className="text-xl text-gray-800 mb-4">Add menu</div>

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

                  <div className="flex flex-col mb-4">
                    <textarea
                      className="w-full text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                      name="description"
                      placeholder="Description"
                      ref={register}
                      defaultValue=""
                    ></textarea>

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
                      defaultValue=""
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
                    <NumberFormat
                      className="text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                      name="price"
                      placeholder="Price"
                      thousandSeparator={true}
                      prefix={"Rp "}
                      getInputRef={register}
                      onValueChange={(values) => {
                        const { value } = values;

                        setState({ ...state, price: value });
                      }}
                      defaultValue=""
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
                          ref={register}
                        />

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
                          ref={register}
                        />

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
                    className="text-sm text-white bg-indigo-700 rounded-lg focus:outline-none px-8 py-2"
                    type="submit"
                  >
                    Save
                  </button>

                  <button
                    className="text-sm text-gray-800 focus:outline-none px-8 py-2"
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
                <div className="text-xl text-gray-800 mb-4">Edit menu</div>

                <div className="mb-8">
                  <div className="flex flex-col mb-4">
                    <input
                      className="w-full text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                      name="name"
                      type="text"
                      placeholder="Name"
                      defaultValue={state.menu?.name}
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
                      defaultValue={state.menu?.description}
                    ></textarea>

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
                      defaultValue={state.menu?.url}
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
                        defaultValue={state.menu?.category.id}
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
                    <NumberFormat
                      className="text-sm text-gray-800 font-medium bg-gray-200 rounded-lg focus:outline-none p-3"
                      name="price"
                      placeholder="Price"
                      thousandSeparator={true}
                      prefix={"Rp "}
                      getInputRef={register}
                      onValueChange={(values) => {
                        const { value } = values;

                        setState({ ...state, price: value });
                      }}
                      defaultValue={state.menu?.price}
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
                          defaultChecked={state.menu?.stock === 1}
                          ref={register}
                        />

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
                          defaultChecked={state.menu?.stock === 0}
                          ref={register}
                        />

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
                    className="text-sm text-white bg-indigo-700 rounded-lg focus:outline-none px-8 py-2"
                    type="submit"
                  >
                    Update
                  </button>

                  <button
                    className="text-sm text-gray-800 focus:outline-none px-8 py-2"
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
                  <h6 className="text-xl text-gray-800 mb-2">Delete menu</h6>

                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete menu? All of your data will
                    be permanently deleted. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  className="text-sm text-gray-800 focus:outline-none px-8 py-2"
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

export default SettingMenu;
