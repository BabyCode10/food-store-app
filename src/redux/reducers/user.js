import * as actionTypes from "../actions/types";

const initialState = {
  users: [],
};

const fetchUser = (state, action) => {
  return {
    ...state,
    users: action.data,
  };
};

const addUser = (state, action) => {
  return {
    ...state,
    users: [...state.users, action.data],
  };
};

const editUser = (state, action) => {
  const newUsers = state.users.map((user) => {
    if (user.id === action.data.id) {
      return action.data;
    }

    return user;
  });

  return { ...state, users: newUsers };
};

const deleteUser = (state, action) => {
  const newUser = state.users.filter((user) => user.id !== action.data.id);

  return { ...state, users: newUser };
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_SUCCESS:
      return fetchUser(state, action);
    case actionTypes.ADD_USER_SUCCESS:
      return addUser(state, action);
    case actionTypes.EDIT_USER_SUCCESS:
      return editUser(state, action);
    case actionTypes.DELETE_USER_SUCCESS:
      return deleteUser(state, action);
    default:
      return state;
  }
};

export default reducers;
