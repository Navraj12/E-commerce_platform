/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/types/types";
import { API } from "../http";

// --- Types ---
interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface User {
  username: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  status: Status;
}

// --- Initial state ---
const initialState: AuthState = {
  user: null,
  status: Status.LOADING,
};

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    resetStatus(state) {
      state.status = Status.LOADING;
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, setStatus, resetStatus, logout } = authSlice.actions;
export default authSlice.reducer;

// --- Thunks ---
// Register user
export function register(data: RegisterData) {
  return async function registerThunk(dispatch: any) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("register", data);
      if (response.status === 201) {
        dispatch(setStatus(Status.SUCCESS));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
    }
  };
}

// Login user
export function login(data: LoginData) {
  return async function loginThunk(dispatch: any) {
    dispatch(setStatus(Status.LOADING));
    try {
      console.log("Sending login request:", data);
      const response = await API.post("login", data);

      if (response.status === 200) {
        const token = response.data.data; // Adjust based on your API

        const user: User = {
          username: response.data.username || "", // get username if your API provides
          email: data.email,
          token,
        };

        // Save token for authenticated requests
        localStorage.setItem("token", token);

        dispatch(setUser(user));
        dispatch(setStatus(Status.SUCCESS));

        // Redirect to homepage
        window.location.href = "/";
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}
