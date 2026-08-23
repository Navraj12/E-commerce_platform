import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../../../store/authSlice.ts";
import { useAppDispatch } from "../../../store/hooks.ts";
import type { UserDataType } from "../types.ts";
import RegisterForm from "./RegisterForm.tsx";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (data: UserDataType) => {
    setSubmitting(true);
    const result = await dispatch(register(data));
    setSubmitting(false);
    if (result.success) {
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } else {
      toast.error(result.message);
    }
  };

  return <RegisterForm onSubmit={handleRegister} submitting={submitting} />;
};

export default Register;
