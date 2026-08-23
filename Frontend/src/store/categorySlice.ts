import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Category, CategoryState } from "../globals/types/adminTypes.ts";
import { Status } from "../globals/types/types.ts";
import { API, APIAuthenticated } from "../http/index.ts";
import type { AppDispatch } from "./store.ts";

const initialState: CategoryState = {
  categories: [],
  status: Status.LOADING,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setStatus(state: CategoryState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setCategories(state: CategoryState, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
  },
});

export const { setStatus, setCategories } = categorySlice.actions;
export default categorySlice.reducer;

export function fetchCategories() {
  return async function fetchCategoriesThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await API.get("/admin/category");
      if (response.status === 200) {
        dispatch(setCategories(response.data.data));
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

export function createCategory(categoryName: string, categoryIcon?: string) {
  return async function createCategoryThunk(
    dispatch: AppDispatch
  ): Promise<boolean> {
    try {
      const response = await APIAuthenticated.post("/admin/category", {
        categoryName,
        categoryIcon,
      });
      if (response.status === 200) {
        await dispatch(fetchCategories());
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };
}

export function updateCategory(id: string, categoryName: string, categoryIcon?: string) {
  return async function updateCategoryThunk(
    dispatch: AppDispatch
  ): Promise<boolean> {
    try {
      const response = await APIAuthenticated.patch(`/admin/category/${id}`, {
        id,
        categoryName,
        categoryIcon,
      });
      if (response.status === 200) {
        await dispatch(fetchCategories());
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };
}

export function deleteCategory(id: string) {
  return async function deleteCategoryThunk(
    dispatch: AppDispatch
  ): Promise<boolean> {
    try {
      const response = await APIAuthenticated.delete(`/admin/category/${id}`);
      if (response.status === 200) {
        await dispatch(fetchCategories());
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };
}
