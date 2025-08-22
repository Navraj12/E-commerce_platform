import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Home from "./pages/home/Home";

import SingleProduct from "./pages/singleProduct/SingleProduct";
import store from "./store/store";
import Cart from "./pages/cart/Cart";
import CheckOut from "./pages/checkout/CheckOut";

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
            <Route path="/checkout/" element={<CheckOut />} />


          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
