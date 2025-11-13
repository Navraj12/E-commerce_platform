import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Status } from "../../../globals/types/types.ts";
import { register, resetStatus } from "../../../store/authSlice.ts";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import Form from "../Form.tsx";
import type { UserDataType } from "../types.ts";

const Register = () => {
  const navigate = useNavigate();
  const { status } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleRegister = async (data: UserDataType) => {
    await dispatch(register(data));
  };
  useEffect(() => {
    if (status === Status.SUCCESS) {
      dispatch(resetStatus());
      navigate("/login");
    }
  }, [status, navigate, dispatch]);
  return <Form onSubmit={handleRegister} type="register" />;
};

export default Register;
