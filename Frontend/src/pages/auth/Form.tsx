import { type ChangeEvent, type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import type { Props, UserDataType } from "./types.ts";

const inputClasses =
  "block w-full rounded-lg border border-gray-300 px-4 py-2.5 leading-6 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/30";
const labelClasses = "text-sm font-medium text-gray-700";

const Form: React.FC<Props> = ({ type, onSubmit, submitting = false }) => {
  const [userData, setUserData] = useState<UserDataType>({
    email: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(userData);
  };

  return (
    <div className="min-h-dvh w-full bg-white">
      {/* Top utility bar */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8 xl:max-w-7xl">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600"
          >
            Online Karobar
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-blue-600">
              Help
            </a>
            <Link
              to={type === "register" ? "/login" : "/register"}
              className="hover:text-blue-600"
            >
              {type === "register" ? "Sign In" : "Register"}
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-md px-4 py-10 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {type === "register" ? "Register" : "Sign In"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {type === "register"
              ? "Let's get you set up with your account. We just need a few details."
              : "Welcome back! Sign in to continue to your account."}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {type === "register" ? (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account yet?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className={labelClasses}>
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className={inputClasses}
              onChange={handleChange}
            />
          </div>

          {type === "register" && (
            <div className="space-y-1">
              <label htmlFor="username" className={labelClasses}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                className={inputClasses}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="password" className={labelClasses}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                className={`${inputClasses} pr-11`}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.29 10.29 0 003.135-3.744.75.75 0 000-.667C17.766 6.542 14.522 4 10.75 4a9.6 9.6 0 00-4.16.94L3.28 2.22zM7.53 6.47l1.634 1.633a3 3 0 013.733 3.733l1.634 1.634a4.5 4.5 0 00-6.999-6.998z" />
                    <path d="M10 17c-3.771 0-7.017-2.544-8.207-6.032a.75.75 0 010-.667 12.66 12.66 0 013.51-4.618l1.09 1.09a11.16 11.16 0 00-2.99 3.945 8.9 8.9 0 004.36 4.36l-1.114 1.114a.75.75 0 001.06 1.06l12.5-12.5a.75.75 0 00-1.06-1.06L15 8.44A5.98 5.98 0 0010 6a5.97 5.97 0 00-1.68.24l1.194 1.194A4.5 4.5 0 0114.5 12l1.34 1.34A11 11 0 0017.9 10.5a.75.75 0 000-.667 10.9 10.9 0 00-1.657-2.487l1.107-1.107A12.4 12.4 0 0119.207 9.968a.75.75 0 010 .667C18.017 14.456 14.771 17 11 17c-.34 0-.673-.02-1-.06z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    <path
                      fillRule="evenodd"
                      d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {type === "login" && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  id="remember_me"
                  name="remember_me"
                  className="size-4 rounded border-gray-300 text-blue-600 focus:ring focus:ring-blue-500/30"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Please wait..."
              : type === "register"
                ? "Create account"
                : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
