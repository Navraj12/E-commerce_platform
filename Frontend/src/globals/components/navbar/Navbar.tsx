import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FetchCartItems } from "../../../store/cartSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { items } = useAppSelector((state) => state.carts);
  console.log(items);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token || !!user.token);
    dispatch(FetchCartItems);
  }, [dispatch, user.token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <>
      <header
        id="page-header"
        className="z-1 flex flex-none items-center bg-white shadow-xs dark:bg-gray-800"
      >
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-7xl">
          <div className="flex justify-between py-4">
            <div className="flex items-center gap-2 lg:gap-6">
              <nav className="hidden items-center gap-2 lg:flex">
                <Link
                  to="/"
                  className="group flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 dark:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <span>Dashboard</span>
                </Link>
                <a
                  href="#"
                  className="group flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:active:border-gray-600"
                >
                  <span>Customers</span>
                </a>
                <a
                  href="#"
                  className="group flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:active:border-gray-600"
                >
                  <span>Projects</span>
                </a>
                <a
                  href="#"
                  className="group flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:active:border-gray-600"
                >
                  <span>Sales</span>
                </a>
              </nav>
            </div>
            <div className="flex items-center">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/register"
                    className="group flex items-center gap-10 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:active:border-gray-600"
                  >
                    <span>Register</span>
                  </Link>
                  <Link
                    to="/login"
                    className="group flex items-center gap-10 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:active:border-gray-600"
                  >
                    <span>Login</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/cart"
                    className="group flex items-center gap-10 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:active:border-gray-600"
                  >
                    <span>
                      Cart <sub>{items.length}</sub>{" "}
                    </span>
                  </Link>

                  <Link
                    to="#"
                    onClick={handleLogout}
                    className="group flex items-center gap-10 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:active:border-gray-600"
                  >
                    <span>Logout</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* <div className="lg:hidden">
            <nav className="flex flex-col gap-2 border-t border-gray-200 py-4 dark:border-gray-700">
              <a
                href="#"
                className="group flex items-center gap-2 rounded-lg border border-blue-50 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 dark:border-transparent dark:bg-gray-700/75 dark:text-white"
              >
                <span>Dashboard</span>
              </a>
              <a
                href="#"
                className="group flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:active:border-gray-600"
              >
                <span>Customers</span>
              </a>
              <a
                href="#"
                className="group flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:active:border-gray-600"
              >
                <span>Projects</span>
              </a>
              <a
                href="#"
                className="group flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:active:border-gray-600"
              >
                <span>Sales</span>
              </a>
            </nav>
          </div> */}
        </div>
      </header>
    </>
  );
};

export default Navbar;
