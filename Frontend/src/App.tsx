import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./pages/auth/forgotPassword/ForgotPassword";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import ResetPassword from "./pages/auth/resetPassword/ResetPassword";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/CheckOut";
import Home from "./pages/home/Home";
import AllProducts from "./pages/products/AllProducts";
import MyOrders from "./pages/orders/myOrders/MyOrders";
import MyOrdersDetails from "./pages/orders/myOrders/MyOrdersDetails";
import SingleProduct from "./pages/singleProduct/SingleProduct";
import Wishlist from "./pages/wishlist/Wishlist";
import AdminRoute from "./pages/admin/AdminRoute";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AccountOverview from "./pages/account/AccountOverview";
import OrdersAndReturns from "./pages/orders/OrdersAndReturns";
import store from "./store/store";

// eslint-disable-next-line react-refresh/only-export-components
export const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/cart/" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/orders" element={<OrdersAndReturns />} />
          <Route path="/account" element={<AccountOverview />} />
          <Route path="/myorders/:id" element={<MyOrdersDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <AdminRoute>
                <AdminCoupons />
              </AdminRoute>
            }
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
