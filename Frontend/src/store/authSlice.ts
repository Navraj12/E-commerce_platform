import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Status } from "../globals/types/types.ts";
import { API, APIAuthenticated } from "../http/index.ts";
import type { AppDispatch } from "./store";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
interface LoginData {
  email: string;
  password: string;
}

interface User {
  id?: string;
  username: string;
  email: string;
  password: string;
  role?: string;
  token: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User;
  status: Status;
}

const initialState: AuthState = {
  user: {} as User,
  status: Status.LOADING,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state: AuthState, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setStatus(state: AuthState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    resetStatus(state: AuthState) {
      state.status = Status.LOADING;
    },
    setToken(state: AuthState, action: PayloadAction<string>) {
      state.user.token = action.payload;
    },
    setProfile(
      state: AuthState,
      action: PayloadAction<{
        id: string;
        username: string;
        email: string;
        role: string;
        firstName?: string;
        lastName?: string;
      }>
    ) {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { setUser, setStatus, resetStatus, setToken, setProfile } =
  authSlice.actions;
export default authSlice.reducer;

export function register(data: RegisterData) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async function registerThunk(dispatch: any) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/register", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        return { success: true as const };
      }
      dispatch(setStatus(Status.ERROR));
      return { success: false as const, message: "Registration failed." };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      const message =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";
      return { success: false as const, message };
    }
  };
}


export function login(data: LoginData) {
  return async function loginThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.post("/login", data);
      if (response.status === 200) {
        const { data } = response.data;
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setToken(data));
        localStorage.setItem("token", data);
        await dispatch(fetchProfile());
        return { success: true as const };
      }
      dispatch(setStatus(Status.ERROR));
      return { success: false as const, message: "Login failed." };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(setStatus(Status.ERROR));
      const message =
        error?.response?.data?.message ||
        "Login failed. Please check your email and password.";
      return { success: false as const, message };
    }
  };
}

export function fetchProfile() {
  return async function fetchProfileThunk(dispatch: AppDispatch) {
    try {
      const response = await APIAuthenticated.get("/profile");
      if (response.status === 200) {
        dispatch(setProfile(response.data.data));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // ignore - user may not be authenticated
    }
  };
}
