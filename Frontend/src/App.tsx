import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import store from "./store/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<h1>This is home Page</h1>} />
            <Route path="/register" element={<h1>This is register Page</h1>} />
            <Route path="/login" element={<h1>This is login Page</h1>} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
