import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../../../store/cartSlice.ts";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import { addToWishlist, removeFromWishlist } from "../../../store/wishlistSlice.ts";
import type { Product } from "../../types/productTypes.ts";
import { getProductImageUrl } from "../../utils/image.ts";

interface CardProps {
  data: Product;
  /** Optional small badge shown top-left of the image (e.g. "Marketplace"). */
  badge?: string;
  /**
   * Show a "Sold by [seller]" subtext. Defaults to false so existing usages
   * (Wishlist, related products, etc.) render unchanged.
   */
  showSoldBy?: boolean;
  /**
   * Label override for the "Sold by ..." text. Falls back to the product's
   * category name, then a generic store name, since the data model has no
   * seller/vendor concept.
   */
  soldByLabel?: string;
}

const Card: React.FC<CardProps> = ({ data, badge, showSoldBy = false, soldByLabel }) => {
  const dispatch = useAppDispatch();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some(
    (item) => item.productId === data.id
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please log in to add items to your cart");
      return;
    }
    dispatch(addToCart(data.id));
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please log in to use the wishlist");
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(data.id));
    } else {
      dispatch(addToWishlist(data.id));
    }
  };

  const rating = data.averageRating ?? 0;
  const hasDiscount =
    typeof data.originalPrice === "number" && data.originalPrice > data.productPrice;
  const soldBy =
    soldByLabel ?? data?.Category?.categoryName ?? "our marketplace";

  return (
    <Link
      to={`/product/${data.id}`}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
        {badge && (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow">
            {badge}
          </span>
        )}
        <img
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          alt={data?.productName || "Product Image"}
          src={getProductImageUrl(data?.productImageUrl)}
        />
        <button
          onClick={handleToggleWishlist}
          aria-label="Toggle wishlist"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110 dark:bg-gray-900/80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isWishlisted ? "#dc2626" : "none"}
            stroke={isWishlisted ? "#dc2626" : "currentColor"}
            strokeWidth="1.8"
            className="h-4.5 w-4.5 text-gray-600 dark:text-gray-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between px-4 py-4">
        <div>
          {data?.Category?.categoryName && (
            <span className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
              {data.Category.categoryName}
            </span>
          )}
          <h3 className="mt-1 truncate text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            {data?.productName}
          </h3>
          {showSoldBy && (
            <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
              Sold by {soldBy}
            </p>
          )}
          <div className="mt-1 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                viewBox="0 0 20 20"
                fill={star <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
                className="h-3.5 w-3.5"
              >
                <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
              </svg>
            ))}
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
              {data.reviewCount ? `(${data.reviewCount})` : "No reviews"}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through dark:text-gray-500">
                Was ${data.originalPrice}
              </span>
            )}
            <span
              className={`text-xl font-bold ${
                hasDiscount
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {hasDiscount ? "Now " : ""}${data?.productPrice}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="rounded-full bg-blue-700 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Card;
