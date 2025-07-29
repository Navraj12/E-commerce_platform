import Form from "../Form";
import type { UserDataType } from "../types";

const Login = () => {
  const handleLogin = (data: UserDataType) => {
    console.log("Login data:", data);
  };

  return <Form isRegister={false} onSubmit={handleLogin} />;
};

export default Login;
