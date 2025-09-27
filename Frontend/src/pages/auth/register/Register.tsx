import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Status } from "../../../globals/types/types";
import { register, resetStatus } from "../../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Form from "../Form";
import type { UserDataType } from "../types";

const Register = () => {
  const navigate = useNavigate();
  const { status } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleRegister = async (data: UserDataType) => {
    dispatch(register(data));
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
