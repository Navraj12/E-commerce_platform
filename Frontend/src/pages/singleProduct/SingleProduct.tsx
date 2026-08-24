import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../globals/components/navbar/Navbar.tsx";
import { addToCart } from "../../store/cartSlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { fetchByProductId } from "../../store/productSlice.ts";
import { addToWishlist, removeFromWishlist } from "../../store/wishlistSlice.ts";
import { getProductImageUrl } from "../../globals/utils/image.ts";
import { API, APIAuthenticated } from "../../http/index.ts";

interface ReviewUser {
  id: string;
  username: string;
}

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  User?: ReviewUser;
  createdAt: string;
}

const Stars = ({
  value,
  onChange,
  size = "h-5 w-5",
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: string;
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          disabled={!onChange}
          onClick={() => onChange?.(star)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <svg
            viewBox="0 0 20 20"
            fill={star <= value ? "#f59e0b" : "#d1d5db"}
            className={size}
          >
            <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { singleProduct } = useAppSelector((state) => state.products);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isWishlisted = wishlistItems.some((item) => item.productId === id);

  const loadReviews = async () => {
    if (!id) return;
    try {
      const response = await API.get(`/review/${id}`);
      setReviews(response.data.data ?? []);
      setAverageRating(response.data.average ?? 0);
      setReviewCount(response.data.count ?? 0);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // silently ignore
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchByProductId(id));
      loadReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!id || !singleProduct) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please log in to add items to your cart");
      return;
    }
    dispatch(addToCart(id));
  };

  const handleToggleWishlist = () => {
    if (!id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please log in to use the wishlist");
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please log in to write a review");
      return;
    }
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    try {
      await APIAuthenticated.post("/review", {
        productId: id,
        rating,
        comment,
      });
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
      await loadReviews();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to submit review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row -mx-4">
            <div className="md:flex-1 px-4">
              <div className="h-[460px] overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                <img
                  src={getProductImageUrl(singleProduct?.productImageUrl)}
                  className="h-full w-full object-cover"
                  alt={singleProduct?.productName || "Product Image"}
                />
              </div>
              <div className="flex -mx-2 mb-4">
                <div className="w-1/2 px-2">
                  <button
                    className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="w-1/2 px-2">
                  <button
                    onClick={handleToggleWishlist}
                    className={`w-full py-2 px-4 rounded-full font-bold transition ${
                      isWishlisted
                        ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {isWishlisted ? "In Wishlist ♥" : "Add to Wishlist"}
                  </button>
                </div>
              </div>
            </div>
            <div className="md:flex-1 px-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {singleProduct?.productName}
              </h2>

              <div className="mb-4 flex items-center gap-2">
                <Stars value={Math.round(averageRating)} />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {averageRating.toFixed(1)} ({reviewCount} review
                  {reviewCount === 1 ? "" : "s"})
                </span>
              </div>

              <div className="flex mb-4">
                <div className="mr-4">
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    Price:
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    ${singleProduct?.productPrice}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    Availability:
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    In Stock
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Product Description:
                </span>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  {singleProduct?.productDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-lg bg-white dark:bg-gray-900 p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Customer Reviews
            </h3>

            <form
              onSubmit={handleSubmitReview}
              className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Write a review
              </p>
              <Stars value={rating} onChange={setRating} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="mt-3 w-full rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white p-3 text-sm outline-none focus:border-blue-500"
                rows={3}
              />
              <button
                type="submit"
                disabled={submitting}
                className="mt-3 rounded-md bg-blue-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-800 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>

            {reviews.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 dark:border-gray-800 pb-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {review.User?.username ?? "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Stars value={review.rating} size="h-4 w-4" />
                    {review.comment && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
