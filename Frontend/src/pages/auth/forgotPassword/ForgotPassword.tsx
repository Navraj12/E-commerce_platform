import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../../http/index.ts";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToken(null);
    try {
      const response = await API.post("/request-reset", { email });
      toast.success("Reset token generated successfully");
      // NOTE: since there is no email service wired up yet, the backend returns the
      // reset token directly in the response so it can be used here for testing.
      setToken(response.data.resetToken);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800 dark:text-white">
          Forgot Password
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Enter your email and we'll generate a reset token for you.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Token"}
          </button>
        </form>

        {token && (
          <div className="mt-6 rounded-md bg-gray-50 p-4 text-sm dark:bg-gray-700">
            <p className="mb-2 text-gray-600 dark:text-gray-300">
              Email delivery isn't wired up yet, so here is your reset token
              for testing:
            </p>
            <p className="break-all font-mono text-xs text-blue-700 dark:text-blue-300">
              {token}
            </p>
            <Link
              to={`/reset-password?token=${token}`}
              className="mt-3 inline-block font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400"
            >
              Continue to reset password
            </Link>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-400 dark:text-blue-400"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
