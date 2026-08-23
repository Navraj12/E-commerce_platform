import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product, ProductState } from "../globals/types/productTypes.ts";
import { Status } from "../globals/types/types";
import { API, APIAuthenticated } from "../http/index.ts";
import type { AppDispatch, RootState } from "./store.ts";

const initialState: ProductState = {
  product: [],
  status: Status.LOADING,
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

export interface ProductQuery {
  search?: string;
  categoryId?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  sortBy?: "price" | "rating";
  order?: "asc" | "desc";
}

export function fetchProducts(query?: ProductQuery) {
  return async function fetchProductsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const params = new URLSearchParams();
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            params.append(key, String(value));
          }
        });
      }
      const queryString = params.toString();
      const response = await API.get(
        `/admin/product${queryString ? `?${queryString}` : ""}`
      );
      if (response.status === 200) {
        const { data } = response.data;
        dispatch(setStatus(Status.SUCCESS));
        dispatch(setProduct(data));
      } else {
        dispatch(setStatus(Status.ERROR));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(setStatus(Status.ERROR));
    }
  };
}

export function createProduct(formData: FormData) {
  return async function createProductThunk(
    dispatch: AppDispatch
  ): Promise<boolean> {
    try {
      const response = await APIAuthenticated.post(
        "/admin/product",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        await dispatch(fetchProducts());
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };
}

export function updateProduct(id: string, formData: FormData) {
  return async function updateProductThunk(
    dispatch: AppDispatch
  ): Promise<boolean> {
    try {
      const response = await APIAuthenticated.patch(
        `/admin/product/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        await dispatch(fetchProducts());
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };
}

export function deleteProduct(id: string) {
  return async function deleteProductThunk(
    dispatch: AppDispatch
  ): Promise<boolean> {
    try {
      const response = await APIAuthenticated.delete(`/admin/product/${id}`);
      if (response.status === 200) {
        await dispatch(fetchProducts());
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
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
        const response = await API.get(`/admin/product/${productId}`);
        if (response.status === 200) {
          const { data } = response.data;
          dispatch(setStatus(Status.SUCCESS));
          dispatch(setSingleProduct(Array.isArray(data) ? data[0] : data));
        } else {
          dispatch(setStatus(Status.ERROR));
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        dispatch(setStatus(Status.ERROR));
      }
    }
  };
}
