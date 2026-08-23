import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCartItems } from "../../../store/cartSlice.ts";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";

/**
 * Self-contained basket summary card.
 * Reads cart state directly from redux (same pattern used in Navbar.tsx
 * for the header cart total) so it can be dropped into any page with no
 * required props.
 */
const BasketSidebar = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.carts);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const cartTotal = items.reduce(
    (sum, item) => sum + (item.Product?.productPrice ?? 0) * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isEmpty = items.length === 0;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Basket</h2>

      {isEmpty ? (
        <div className="flex flex-col items-center py-6 text-center">
          <svg
            className="mb-3 h-14 w-14 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7h18l-1.5 12.5a2 2 0 01-2 1.5H6.5a2 2 0 01-2-1.5L3 7z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V5a4 4 0 118 0v2"
            />
          </svg>
          <p className="text-sm font-semibold text-gray-900">
            Your basket is empty
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Products you add to your basket will appear here.
          </p>
        </div>
      ) : (
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-4">
          <svg
            className="h-8 w-8 shrink-0 text-blue-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7h18l-1.5 12.5a2 2 0 01-2 1.5H6.5a2 2 0 01-2-1.5L3 7z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V5a4 4 0 118 0v2"
            />
          </svg>
          <div>
            <p className="text-sm text-gray-500">
              {itemCount} item{itemCount === 1 ? "" : "s"}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              Rs. {cartTotal.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {isEmpty ? (
        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed rounded-full bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-400"
        >
          Checkout
        </button>
      ) : (
        <Link
          to="/checkout"
          className="block w-full rounded-full bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Checkout
        </Link>
      )}
    </div>
  );
};

export default BasketSidebar;
