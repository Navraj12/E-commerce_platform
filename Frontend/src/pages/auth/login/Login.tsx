import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../../store/authSlice.ts";
import { useAppDispatch } from "../../../store/hooks.ts";
import Form from "../Form.tsx";
import type { UserLoginType } from "../types.ts";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (data: UserLoginType) => {
    setSubmitting(true);
    const result = await dispatch(login(data));
    setSubmitting(false);
    if (result.success) {
      navigate("/");
    } else {
      toast.error(result.message);
    }
  };

  return <Form onSubmit={handleLogin} type="login" submitting={submitting} />;
};

export default Login;
