import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  user: null,
  admin: null,
  token: null,
  tasks: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      // user login
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.admin = null;
    },
    setAdmin: (state, action) => {
      // admin login
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.user = null;
      state.admin = null;
      state.token = null;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload.tasks;
    },
    // when we update/set the particular task
    setTask: (state, action) => {
      const updatedTasks = state.tasks.map((task) => {
        if (task._id === action.payload.task._id) return action.payload.task;
        return task;
      });
      state.tasks = updatedTasks;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setTasks,
  setTask,
  setUser,
  setAdmin,
} = authSlice.actions;

export default authSlice.reducer;
