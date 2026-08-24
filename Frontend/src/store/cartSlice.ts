import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { type CartItem, type CartState } from "../globals/types/cartTypes.ts";
import { Status } from "../globals/types/types.ts";
import { APIAuthenticated } from "../http/index.ts";
import type { AppDispatch } from "./store.ts";

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
    setItems(state: CartState, action: PayloadAction<CartItem | CartItem[]>) {
      const payload = action.payload;

      if (Array.isArray(payload)) {
        state.items = payload;
        return;
      }

      const existing = state.items.find(
        (item) => item.Product.id === payload.productId
      );

      if (existing) {
        existing.quantity = payload.quantity;
      } else {
        state.items.push(payload);
      }
    },
    setStatus(state: CartState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setDeleteItem(state: CartState, action: PayloadAction<DeleteAction>) {
      const index = state.items.findIndex(
        (item) => item.Product.id === action.payload.productId
      );
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    clearCartItems: (state) => {
      state.items = [];
    },

    setUpdateItem(state: CartState, action: PayloadAction<UpdateAction>) {
      const index = state.items.findIndex(
        (item) => item.Product.id === action.payload.productId
      );
      if (index !== -1) {
        state.items[index].quantity = action.payload.quantity;
      }
    },
  },
});

export const {
  setItems,
  setStatus,
  setDeleteItem,
  setUpdateItem,
  clearCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;

export function addToCart(productId: string) {
  return async function addToCartThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.post("/customer/cart", {
        productId,
        quantity: 1,
      });
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        toast.success("Product is added in cart");
        await fetchCartItems()(dispatch);
      } else {
        dispatch(setStatus(Status.ERROR));
        toast.error("Could not add product to cart");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      toast.error("Could not add product to cart");
    }
  };
}

export function fetchCartItems() {
  return async function fetchCartItemsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/customer/cart");
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setItems(response.data.data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function deleteCartItem(productId: string) {
  return async function deleteCartItemThunk(
    dispatch: AppDispatch
  ): Promise<boolean> {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.delete(
        "/customer/cart/" + productId
      );
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setDeleteItem({ productId }));
        return true;
      } else {
        dispatch(setStatus(Status.ERROR));
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      return false;
    }
  };
}

export function updateCartItem(productId: string, quantity: number) {
  return async function updateCartItemThunk(
    dispatch: AppDispatch
  ): Promise<boolean> {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.patch(
        "/customer/cart/" + productId,
        {
          quantity,
        }
      );
      if (response.status === 200) {
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setUpdateItem({ productId, quantity }));
        return true;
      } else {
        dispatch(setStatus(Status.ERROR));
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      return false;
    }
  };
}
