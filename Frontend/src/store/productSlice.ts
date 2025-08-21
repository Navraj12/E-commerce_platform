import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type {} from "@reduxjs/toolkit/query";
import type { Product, ProductState } from "../globals/types/productTypes";
import { Status } from "../globals/types/types";
import { API } from "../http";
import type { AppDispatch, RootState } from "./store";

const initialState: ProductState = {
  product: [],
  status: "loading",
  singleProduct: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProduct(state: ProductState, action: PayloadAction<Product[]>) {
      state.product = action.payload;
    },
    setStatus(state: ProductState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setSingleProduct(state: ProductState, action: PayloadAction<Product>) {
      state.singleProduct = action.payload;
    },
  },
});

export const { setProduct, setStatus, setSingleProduct } = productSlice.actions;
export default productSlice.reducer;

export function fetchProducts() {
  return async function fetchProductThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.get("admin/product");
      if (response.status === 200) {
        const { data } = response.data;
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setProduct(data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
    } catch {
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function fetchByProductId(productId: string) {
  return async function fetchByProductIdThunk(
    dispatch: AppDispatch,
    getState: () => RootState
  ) {
    const state = getState();
    const existingProduct = state.products.product.find(
      (product: Product) => product.id === productId
    );
    if (existingProduct) {
      dispatch(setSingleProduct(existingProduct));
      dispatch(setStatus(Status.SUCCESS));
    } else {
      dispatch(setStatus(Status.LOADING));
      try {
        const response = await API.get(`admin/product/${productId}`);
        if (response.status === 200) {
          const { data } = response.data;
          dispatch(setStatus(Status.SUCCESS));
          dispatch(setSingleProduct(data));
        } else {
          dispatch(setStatus(Status.ERROR));
        }
      } catch {
        dispatch(setStatus(Status.ERROR));
      }
    }
  };
}
