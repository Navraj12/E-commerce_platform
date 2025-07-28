// import { data } from "react-router-dom";
import Form from "../Form";
import type { UserDataType } from "../types";

const Register = () => {
  const handleRegister = (data: UserDataType) => {
    console.log(data);
  };

  return <Form isRegister={true} onSubmit={handleRegister} />;
};

export default Register;
