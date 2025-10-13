import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import io from "socket.io-client";
import Login from "./pages/auth/login/Login.tsx";
import Register from "./pages/auth/register/Register.tsx";
import Cart from "./pages/cart/Cart.tsx";
import Checkout from "./pages/checkout/CheckOut.tsx";
import Home from "./pages/home/Home.tsx";
import MyOrders from "./pages/orders/myOrders/MyOrders.tsx";
import MyOrdersDetails from "./pages/orders/myOrders/MyOrdersDetails.tsx";
import SingleProduct from "./pages/singleProduct/SingleProduct.tsx";
import store from "./store/store.ts";

// Socket instance moved to src/socket.ts for Fast Refresh compatibility

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
