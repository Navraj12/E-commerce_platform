import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  MyOrderData,
  OrderData,
  OrderDetails,
  OrderResponseData,
  OrderResponseItem,
  OrderStatus,
} from "../globals/types/checkOutTypes.ts";
import { Status } from "../globals/types/types.ts";
import { APIAuthenticated } from "../http/index.ts";
import type { AppDispatch } from "./store.ts";

const initialState: OrderResponseData = {
  items: [],
  status: Status.LOADING,
  khaltiUrl: null,
  myOrders: [],
  orderDetails: [],
  state: {} as MyOrderData,
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
    setMyOrderDetails(
      state: OrderResponseData,
      action: PayloadAction<OrderDetails[]>
    ) {
      state.orderDetails = action.payload;
    },
    updateOrderStatus(
      state: OrderResponseData,
      action: PayloadAction<{ status: OrderStatus; orderId: string }>
    ) {
      const status = action.payload.status;
      const orderId = action.payload.orderId;
      const updatedOrder = state.myOrders.map((order) =>
        order.id == orderId ? { ...order, orderStatus: status } : order
      );
      state.myOrders = updatedOrder;
    },
  },
});

export const {
  setItems,
  setStatus,
  setKhaltiUrl,
  setMyOrders,
  setMyOrderDetails,
  updateOrderStatus,
} = orderSlice.actions;
export default orderSlice.reducer;

export function orderItem(data: OrderData) {
  return async function orderItemThunk(
    dispatch: AppDispatch
  ): Promise<{ status: Status; khaltiUrl: string | null }> {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.post("/order", data);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        if (response.data.data) {
          dispatch(setItems(response.data.data));
        }
        const khaltiUrl: string | null = response.data.url ?? null;
        dispatch(setKhaltiUrl(khaltiUrl));
        return { status: Status.SUCCESS, khaltiUrl };
      }
      dispatch(setStatus(Status.ERROR));
      return { status: Status.ERROR, khaltiUrl: null };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      return { status: Status.ERROR, khaltiUrl: null };
    }
  };
}

export function fetchMyOrders() {
  return async function fetchMyOrdersThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/order/customer");
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

export function fetchMyOrderDetails(id: string) {
  return async function fetchMyOrderDetailsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/order/customer/" + id);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setMyOrderDetails(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function cancelMyOrder(id: string) {
  return async function cancelMyOrderThunk(
    dispatch: AppDispatch
  ): Promise<{ status: Status }> {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.patch("/order/customer/" + id);
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        return { status: Status.SUCCESS };
      } else {
        dispatch(setStatus(Status.ERROR));
        return { status: Status.ERROR };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      return { status: Status.ERROR };
    }
  };
}

export function verifyKhaltiPayment(pidx: string) {
  return async function verifyKhaltiPaymentThunk(): Promise<boolean> {
    try {
      const response = await APIAuthenticated.post("/order/verify", { pidx });
      return (
        response.status === 200 &&
        response.data.message === "Payment verified successfully"
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };
}

export function updateOrderStatusInStore(data: {
  status: OrderStatus;
  orderId: string;
}) {
  return function updateOrderStatusInStoreThunk(dispatch: AppDispatch) {
    dispatch(updateOrderStatus(data));
  };
}
