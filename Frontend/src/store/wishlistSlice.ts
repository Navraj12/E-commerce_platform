import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WishlistItem, WishlistState } from "../globals/types/wishlistTypes.ts";
import { Status } from "../globals/types/types.ts";
import { APIAuthenticated } from "../http/index.ts";
import type { AppDispatch } from "./store.ts";

const initialState: WishlistState = {
  items: [],
  status: Status.LOADING,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setItems(state: WishlistState, action: PayloadAction<WishlistItem[]>) {
      state.items = action.payload;
    },
    setStatus(state: WishlistState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    removeItem(state: WishlistState, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },
  },
});

export const { setItems, setStatus, removeItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;

export function fetchWishlist() {
  return async function fetchWishlistThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/wishlist");
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

export function addToWishlist(productId: string) {
  return async function addToWishlistThunk(dispatch: AppDispatch) {
    try {
      const response = await APIAuthenticated.post("/wishlist", { productId });
      if (response.status === 200) {
        await fetchWishlist()(dispatch);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function removeFromWishlist(productId: string) {
  return async function removeFromWishlistThunk(
    dispatch: AppDispatch
  ): Promise<boolean> {
    try {
      const response = await APIAuthenticated.delete(`/wishlist/${productId}`);
      if (response.status === 200) {
        dispatch(removeItem(productId));
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
      return false;
    }
  };
}
