import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Status } from "../../../globals/types/types.ts";
import { login, resetStatus } from "../../../store/authSlice.ts";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import Form from "../Form.tsx";
import type { UserLoginType } from "../types.ts";

const Login = () => {
  const navigate = useNavigate();
  const { status } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleLogin = async (data: UserLoginType) => {
    await dispatch(login(data));
  };
  useEffect(() => {
    if (status === Status.SUCCESS) {
      dispatch(resetStatus());
      navigate("/");
    }
  }, [status, navigate, dispatch]);
  return <Form onSubmit={handleLogin} type="login" />;
};

export default Login;
