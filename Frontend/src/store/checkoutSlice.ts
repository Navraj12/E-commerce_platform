import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  MyOrderData,
  OrderData,
  OrderResponseData,
  OrderResponseItem,
} from "../globals/types/checkOutTypes";
import { Status } from "../globals/types/types";
import { APIAuthenticated } from "../http";
import { setStatus } from "./authSlice";
import type { AppDispatch } from "./store";
// import { setStatus } from "./authSlice"; // Renamed or removed to avoid conflict

const initialState: OrderResponseData = {
  state: {} as MyOrderData,
  items: [],
  status: Status.LOADING,
  khaltiUrl: null,
  myOrders: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setItems(
      state: OrderResponseData,
      action: PayloadAction<OrderResponseItem>
    ) {
      state.items.push(action.payload);
    },

    setMyOrders(
      state: OrderResponseData,
      action: PayloadAction<MyOrderData[]>
    ) {
      state.myOrders = action.payload;
    },

    setStatus(state: OrderResponseData, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setKhaltiUrl(
      state: OrderResponseData,
      action: PayloadAction<OrderResponseData["khaltiUrl"]>
    ) {
      state.khaltiUrl = action.payload;
    },
  },
});

export const {
  setItems,
  setStatus: setOrderStatus,
  setKhaltiUrl,
  setMyOrders,
} = orderSlice.actions;
export default orderSlice.reducer;

export function orderItem(data: OrderData) {
  return async function orderItemThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.post("/order", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setItems(response.data.data));
        if (response.data.url) {
          dispatch(setKhaltiUrl(response.data.url));
        } else {
          dispatch(setKhaltiUrl(null));
        }
      } else {
        dispatch(setStatus(Status.ERROR));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function fetchMyOrders() {
  return async function fetchMyOrderThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.post("/order/customer");
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setMyOrders(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
    }
  };
}
