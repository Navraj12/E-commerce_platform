import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/CheckOut";
import Home from "./pages/home/Home";
import MyOrders from "./pages/orders/myOrders/MyOrders";
import MyOrdersDetails from "./pages/orders/myOrders/MyOrdersDetails";
import SingleProduct from "./pages/singleProduct/SingleProduct";
import socket from "./socket";
import store from "./store/store";

console.log("Socket connected:", socket.connected);

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<SingleProduct />} />
          <Route path="/cart/" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/myorders/:id" element={<MyOrdersDetails />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
