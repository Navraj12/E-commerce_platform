// import { data } from "react-router-dom";
import axios from "axios";
import { register } from "../../../store/authSlice";
import Form from "../Form";
import type { UserDataType } from "../types";
import { useDispatch } from "react-redux";

const Register = () => {
const dispatch = useDispatch()

  const handleRegister = async(data: UserDataType) => {
    console.log(data);
// dispatch(register(data))
const response = await axios.post('http://localhost:3000/register',data)
  };

  return <Form isRegister={true} onSubmit={handleRegister} />;
};

export default Register;
