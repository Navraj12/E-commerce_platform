import { Link } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks.ts";

const GreetingStrip = () => {
  const { user } = useAppSelector((state) => state.auth);

  const displayName = user?.firstName?.trim() || user?.username || "there";

  return (
    <div className="bg-white px-4 pt-6 text-gray-600 dark:bg-gray-900 lg:px-8">
      <div className="container mx-auto xl:max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
              Hello {displayName}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Ready to start shopping?
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/myorders"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              My Orders
            </Link>
            <Link
              to="/wishlist"
              className="rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              View Wishlist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreetingStrip;
