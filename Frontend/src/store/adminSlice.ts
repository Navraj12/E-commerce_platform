import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminState, AdminUser, DashboardStats } from "../globals/types/adminTypes.ts";
import type { MyOrderData, OrderStatus } from "../globals/types/checkOutTypes.ts";
import { Status } from "../globals/types/types.ts";
import { APIAuthenticated } from "../http/index.ts";
import type { AppDispatch } from "./store.ts";

const initialState: AdminState = {
  stats: null,
  orders: [],
  users: [],
  status: Status.LOADING,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setStatus(state: AdminState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setStats(state: AdminState, action: PayloadAction<DashboardStats>) {
      state.stats = action.payload;
    },
    setOrders(state: AdminState, action: PayloadAction<MyOrderData[]>) {
      state.orders = action.payload;
    },
    setUsers(state: AdminState, action: PayloadAction<AdminUser[]>) {
      state.users = action.payload;
    },
    updateOrderStatusInList(
      state: AdminState,
      action: PayloadAction<{ orderId: string; orderStatus: OrderStatus }>
    ) {
      state.orders = state.orders.map((order) =>
        order.id === action.payload.orderId
          ? { ...order, orderStatus: action.payload.orderStatus }
          : order
      );
    },
    updateUserRoleInList(
      state: AdminState,
      action: PayloadAction<{ id: string; role: string }>
    ) {
      state.users = state.users.map((u) =>
        u.id === action.payload.id ? { ...u, role: action.payload.role } : u
      );
    },
  },
});

export const {
  setStatus,
  setStats,
  setOrders,
  setUsers,
  updateOrderStatusInList,
  updateUserRoleInList,
} = adminSlice.actions;
export default adminSlice.reducer;

export function fetchDashboardStats() {
  return async function fetchDashboardStatsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/admin/dashboard-stats");
      if (response.status === 200) {
        dispatch(setStats(response.data.data));
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

export function fetchAllOrders() {
  return async function fetchAllOrdersThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/order");
      if (response.status === 200) {
        dispatch(setOrders(response.data.data));
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

export function updateOrderStatus(orderId: string, orderStatus: OrderStatus) {
  return async function updateOrderStatusThunk(
    dispatch: AppDispatch
  ): Promise<boolean> {
    try {
      const response = await APIAuthenticated.patch(`/order/admin/${orderId}`, {
        orderStatus,
      });
      if (response.status === 200) {
        dispatch(updateOrderStatusInList({ orderId, orderStatus }));
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };
}

export function fetchAllUsers() {
  return async function fetchAllUsersThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/users");
      if (response.status === 200) {
        dispatch(setUsers(response.data.data));
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

export function updateUserRole(id: string, role: string) {
  return async function updateUserRoleThunk(
    dispatch: AppDispatch
  ): Promise<boolean> {
    try {
      const response = await APIAuthenticated.patch(`/users/${id}/role`, {
        role,
      });
      if (response.status === 200) {
        dispatch(updateUserRoleInList({ id, role }));
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };
}

export function deleteUserById(id: string) {
  return async function deleteUserByIdThunk(
    dispatch: AppDispatch,
    getState: () => { admin: AdminState }
  ): Promise<boolean> {
    try {
      const response = await APIAuthenticated.delete(`/users/${id}`);
      if (response.status === 200) {
        const state = getState();
        dispatch(setUsers(state.admin.users.filter((u) => u.id !== id)));
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };
}
