import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useLocation } from "react-router-dom";
import type { UserDataType } from "./types";

type FormProps = {
  isRegister?: boolean;
  onSubmit: (data: UserDataType) => void;
};

const Form: React.FC<FormProps> = ({ isRegister = false, onSubmit }) => {
  const [userData, setUserData] = useState<UserDataType>({
    email: "",
    username: "",
    password: "",
  });
  const location = useLocation();

  // Reset form whenever the route changes
  useEffect(() => {
    setUserData({ email: "", username: "", password: "" });
  }, [location.pathname]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("✅ Data from form:", userData);
    onSubmit(userData);
  };

  return (
    <div
      id="page-container"
      className="mx-auto flex min-h-screen w-full min-w-80 flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
    >
      <main id="page-content" className="flex max-w-full flex-auto flex-col">
        <div className="relative mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center p-4 lg:p-8">
          <section className="w-full max-w-md py-6">
            {/* Header */}
            <header className="mb-10 text-center">
              <h1 className="mb-2 flex items-center justify-center gap-2 text-2xl font-bold">
                {/* You can replace the path with a valid icon */}
                <svg
                  className="size-6 text-blue-600 dark:text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    // d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 14h2v2h-2v-2zm0-8h2v6h-2V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Company</span>
              </h1>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Welcome, please {isRegister ? "sign up" : "sign in"} to your
                dashboard
              </h2>
            </header>

            {/* Card */}
            <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
              <div className="p-6 md:p-10">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {isRegister && (
                    <div>
                      <label
                        htmlFor="username"
                        className="mb-1 block text-sm font-medium"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={userData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1 block text-sm font-medium"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember_me"
                        name="remember_me"
                        className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      Remember me
                    </label>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-400"
                  >
                    {isRegister ? "Sign Up" : "Sign In"}
                  </button>
                </form>
              </div>

              <div className="border-t bg-gray-50 px-6 py-4 text-center text-sm dark:border-gray-700 dark:bg-gray-700/50">
                {isRegister ? (
                  <>
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                      Sign in
                    </Link>
                  </>
                ) : (
                  <>
                    Don’t have an account yet?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Form;
