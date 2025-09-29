import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import cartSlice from "./cartSlice";
import checkoutSlice from "./checkoutSlice";
import productSlice from "./productSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    carts: cartSlice,
    orders: checkoutSlice,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
