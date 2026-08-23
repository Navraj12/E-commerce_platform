import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./adminSlice.ts";
import authSlice from "./authSlice.ts";
import cartSlice from "./cartSlice.ts";
import categorySlice from "./categorySlice.ts";
import checkoutSlice from "./checkoutSlice.ts";
import couponSlice from "./couponSlice.ts";
import productSlice from "./productSlice.ts";
import wishlistSlice from "./wishlistSlice.ts";

const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    carts: cartSlice,
    orders: checkoutSlice,
    wishlist: wishlistSlice,
    admin: adminSlice,
    categories: categorySlice,
    coupons: couponSlice,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
