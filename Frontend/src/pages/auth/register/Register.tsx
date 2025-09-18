// import { data } from "react-router-dom";
// import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Status } from "../../../globals/types/types";
import { register, resetStatus } from "../../../store/authSlice";
import { useAppSelector } from "../../../store/hooks";
import type { AppDispatch } from "../../../store/store";
import Form from "../Form";
import type { UserDataType } from "../types";

const Register = () => {
  const navigate = useNavigate();
  const { status } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleRegister = async (data: UserDataType) => {
    dispatch(register(data));
  };
  useEffect(() => {
    if (status === Status.SUCCESS) {
      dispatch(resetStatus());
      navigate("/login");
    }

    if (status === Status.ERROR) {
      alert("Something went wrong");
      dispatch(resetStatus());
    }
  }, [dispatch, navigate, status]);

  return <Form isRegister={true} onSubmit={handleRegister} />;
};

export default Register;
