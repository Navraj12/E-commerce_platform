import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Status } from "../../../globals/types/types";
import { login, resetStatus } from "../../../store/authSlice";
import { useAppSelector } from "../../../store/hooks";
import type { AppDispatch } from "../../../store/store";
import Form from "../Form";
import type { UserLoginType } from "../types";

const Login = () => {
  // const handleLogin = (data: UserDataType) => {
  //   console.log("Login data:", data);
  // };
  const navigate = useNavigate();
  const { status } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async (data: UserLoginType) => {
    const loginData = { email: data.email, password: data.password };
    console.log("Sending login request:", loginData);
    dispatch(login(loginData));
  };

  useEffect(() => {
    console.log("Status changed to:", status);
    if (status === Status.SUCCESS) {
      console.log("✅ Login successful, navigating home...");
      dispatch(resetStatus());
      navigate("/");
    }
    if (status === Status.ERROR) {
      alert("Something went wrong");
      dispatch(resetStatus());
    }
  }, [dispatch, navigate, status]);

  return <Form isRegister={false} onSubmit={handleLogin} />;
};

export default Login;
