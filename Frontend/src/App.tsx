import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Home from "./pages/home/Home";

import Cart from "./pages/cart/Cart";
import CheckOut from "./pages/checkout/CheckOut";
import MyOrders from "./pages/orders/myOrders/MyOrders";
import SingleProduct from "./pages/singleProduct/SingleProduct";
import store from "./store/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<SingleProduct />} />
            <Route path="/cart/" element={<Cart />} />
            <Route path="/checkout" element={<CheckOut />} />
            <Route path="/myorders" element={<MyOrders />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
