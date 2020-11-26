import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import axios from "axios";

import * as actions from "../../../redux/actions";

const Category = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const category = useSelector((state) => state.category);

  useEffect(() => {
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

  let categories = useMemo(() => category.categories, [category.categories]);

  return (
    <div className="flex items-center overflow-x-auto text-gray-800 mb-8">
      <NavLink
        className="border rounded-lg group hover:bg-indigo-700 hover:border-indigo-700 px-4 py-2 mr-3"
        activeClassName="text-white bg-indigo-700 border-indigo-700"
        exact
        to="/menu"
      >
        <div className="text-sm font-medium group-hover:text-white">All</div>
      </NavLink>

      {categories.map((category, index) => (
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
      ))}
    </div>
  );
};

export default Category;
