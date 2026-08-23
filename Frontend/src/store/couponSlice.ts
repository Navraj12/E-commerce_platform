import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Coupon, CouponState } from "../globals/types/adminTypes.ts";
import { Status } from "../globals/types/types.ts";
import { APIAuthenticated } from "../http/index.ts";
import type { AppDispatch } from "./store.ts";

const initialState: CouponState = {
  coupons: [],
  status: Status.LOADING,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    setStatus(state: CouponState, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    setCoupons(state: CouponState, action: PayloadAction<Coupon[]>) {
      state.coupons = action.payload;
    },
  },
});

export const { setStatus, setCoupons } = couponSlice.actions;
export default couponSlice.reducer;

export function fetchCoupons() {
  return async function fetchCouponsThunk(dispatch: AppDispatch) {
    dispatch(setStatus(Status.LOADING));
    try {
      const response = await APIAuthenticated.get("/coupon");
      if (response.status === 200) {
        dispatch(setCoupons(response.data.data));
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

export interface CreateCouponData {
  code: string;
  discountPercent: number;
  expiryDate: string;
  active?: boolean;
}

export function createCoupon(data: CreateCouponData) {
  return async function createCouponThunk(
    dispatch: AppDispatch
  ): Promise<boolean> {
    try {
      const response = await APIAuthenticated.post("/coupon", data);
      if (response.status === 200) {
        await dispatch(fetchCoupons());
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };
}

export function deleteCoupon(id: string) {
  return async function deleteCouponThunk(
    dispatch: AppDispatch
  ): Promise<boolean> {
    try {
      const response = await APIAuthenticated.delete(`/coupon/${id}`);
      if (response.status === 200) {
        await dispatch(fetchCoupons());
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };
}
