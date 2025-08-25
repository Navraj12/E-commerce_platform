import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartState } from "../globals/types/cartTypes";
import { Status } from "../globals/types/types";
import { APIAuthenticated } from "../http";
import type { AppDispatch } from "./store";

const initialState: CartState = {
  items: [],
  status: Status.LOADING,
};

interface DeleteAction {
  productId: string;
}

interface UpdateAction extends DeleteAction {
  quantity: number;
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setDeleteItem(state, action: PayloadAction<DeleteAction>) {
      state.items = state.items.filter(
        (item) => item.Product.id !== action.payload.productId
      );
    },
    setUpdateItem(state, action: PayloadAction<UpdateAction>) {
      const index = state.items.findIndex(
        (item) => item.Product.id === action.payload.productId
      );
      if (index !== -1) {
        state.items[index].quantity = action.payload.quantity;
      }
    },
  },
});

export const { setItems, setStatus, setDeleteItem, setUpdateItem } =
  cartSlice.actions;

export default cartSlice.reducer;

// --- Thunks ---
export function addToCart(productId: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.post("/customer/cart", {
        productId,
        quantity: 1,
      });
      dispatch(setItems(response.data.data));
      dispatch(setStatus(Status.SUCCESS));
    } catch (error) {
      console.error("Add to cart error:", error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function fetchCartItems() {
  return async (dispatch: AppDispatch) => {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/customer/cart");
      dispatch(setItems(response.data.data));
      dispatch(setStatus(Status.SUCCESS));
    } catch (error) {
      console.error("Fetch cart error:", error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function deleteCartItem(productId: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(setStatus(Status.LOADING));
    try {
      await APIAuthenticated.delete(`/customer/cart/${productId}`);
      dispatch(setDeleteItem({ productId }));
      dispatch(setStatus(Status.SUCCESS));
    } catch (error) {
      console.error("Delete cart item error:", error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function updateCartItem(productId: string, quantity: number) {
  return async (dispatch: AppDispatch) => {
    dispatch(setStatus(Status.LOADING));
    try {
      await APIAuthenticated.patch(`/customer/cart/${productId}`, { quantity });
      dispatch(setUpdateItem({ productId, quantity }));
      dispatch(setStatus(Status.SUCCESS));
    } catch (error) {
      console.error("Update cart item error:", error);
      dispatch(setStatus(Status.ERROR));
    }
  };
}
