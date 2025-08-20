import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import cartSlice from "./cartSlice";
import productSlice from "./productSlice";
const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    carts: cartSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
