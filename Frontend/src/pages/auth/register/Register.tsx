// import { data } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { register } from "../../../store/authSlice";
import type { AppDispatch } from "../../../store/store";
import Form from "../Form";
import type { UserDataType } from "../types";

const Register = () => {
  // const dispatch = useDispatch();
  const dispatch = useDispatch<AppDispatch>();

  const handleRegister = async (data: UserDataType) => {
    console.log(data);
    dispatch(register(data));
    const response = await axios.post("http://localhost:3000/register", data);
    console.log(response.data);
  };

  return <Form isRegister={true} onSubmit={handleRegister} />;
};

export default Register;
