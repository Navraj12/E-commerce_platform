import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchCartItems } from "../../../store/cartSlice.ts";
import { fetchProfile } from "../../../store/authSlice.ts";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import { fetchWishlist } from "../../../store/wishlistSlice.ts";
import { fetchCategories } from "../../../store/categorySlice.ts";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { items } = useAppSelector((state) => state.carts);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { categories } = useAppSelector((state) => state.categories);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token || !!user?.token);
    if (token || user?.token) {
      dispatch(fetchCartItems());
      dispatch(fetchWishlist());
      if (!user?.role) {
        dispatch(fetchProfile());
      }
    }
  }, [dispatch, user?.token, user?.role]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
  };

  const goToCategory = (categoryId: string) => {
    navigate(`/?category=${encodeURIComponent(categoryId)}`);
  };

  const linkClasses =
    "group flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-blue-50 hover:text-blue-600 active:border-blue-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white dark:active:border-gray-600";

  const cartTotal = items.reduce(
    (sum, item) => sum + (item.Product?.productPrice ?? 0) * item.quantity,
    0
  );

  const initials = (() => {
    const first = user?.firstName?.trim();
    const last = user?.lastName?.trim();
    if (first || last) {
      return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
    }
    const name = user?.username || user?.email || "";
    return name.slice(0, 2).toUpperCase();
  })();

  return (
    <header
      id="page-header"
      className="sticky top-0 z-10 flex flex-none flex-col bg-white shadow-sm dark:bg-gray-800"
    >
      <div className="container mx-auto px-4 lg:px-8 xl:max-w-7xl">
        {/* Row 1: logo, search, auth actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 dark:border-transparent dark:bg-gray-700 dark:text-white"
          >
            Online Karobar
          </Link>

          <form
            onSubmit={handleSearch}
            className="order-last w-full sm:order-none sm:mx-4 sm:max-w-2xl sm:flex-1"
          >
            <div className="relative flex items-center rounded-full border border-gray-300 bg-gray-50 shadow-sm transition focus-within:border-blue-500 focus-within:ring focus-within:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full bg-transparent px-5 py-2.5 text-sm outline-none dark:text-white"
              />
              <button
                type="submit"
                aria-label="Search"
                className="mr-1.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:hover:bg-gray-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/wishlist" className={linkClasses}>
                  Wishlist{" "}
                  {wishlistItems.length > 0 && (
                    <sup className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {wishlistItems.length}
                    </sup>
                  )}
                </Link>
                <Link to="/myorders" className={linkClasses}>
                  My Orders
                </Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className={linkClasses}>
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/cart" className={linkClasses}>
                  Cart{" "}
                  {items.length > 0 && (
                    <sup className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {items.length}
                    </sup>
                  )}
                  <span className="ml-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Rs. {cartTotal.toFixed(2)}
                  </span>
                </Link>
                <span
                  title={user?.username || user?.email}
                  className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white"
                >
                  {initials}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Row 2: slim secondary nav - all departments dropdown + category text links */}
        {categories.length > 0 && (
          <div className="flex items-center gap-4 overflow-x-auto border-t border-gray-100 py-1.5 text-xs text-gray-600 scrollbar-hide dark:border-gray-700 dark:text-gray-400">
            <div className="relative flex-none group">
              <button
                type="button"
                className="flex items-center gap-1 rounded-md px-2 py-1 font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                All Departments
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.148l3.71-3.918a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="invisible absolute left-0 top-full z-20 mt-1 w-48 rounded-lg border border-gray-100 bg-white py-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => goToCategory(cat.id)}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <span>{cat.categoryIcon || "🏷️"}</span>
                    <span>{cat.categoryName}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-nowrap items-center gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => goToCategory(cat.id)}
                  className="flex-none whitespace-nowrap text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Row 3: circular category icon row - horizontally scrollable, never wraps */}
        {categories.length > 0 && (
          <div className="flex flex-nowrap items-start gap-5 overflow-x-auto border-t border-gray-100 px-1 py-3 snap-x scrollbar-hide dark:border-gray-700">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => goToCategory(cat.id)}
                className="flex flex-none snap-start flex-col items-center gap-1 text-center"
                title={cat.categoryName}
              >
                <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-2xl shadow-sm transition hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-700">
                  {cat.categoryIcon || "🏷️"}
                </span>
                <span className="w-16 truncate text-[11px] font-medium text-gray-500 dark:text-gray-400">
                  {cat.categoryName}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
