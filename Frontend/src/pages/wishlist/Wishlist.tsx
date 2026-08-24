import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../globals/components/navbar/Navbar.tsx";
import Footer from "../../globals/components/footer/Footer.tsx";
import { getProductImageUrl } from "../../globals/utils/image.ts";
import { addToCart } from "../../store/cartSlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { fetchWishlist, removeFromWishlist } from "../../store/wishlistSlice.ts";
import { Status } from "../../globals/types/types.ts";

const Wishlist = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleAddToCart = (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please log in to add items to your cart");
      return;
    }
    dispatch(addToCart(productId));
  };

  const handleRemove = async (productId: string) => {
    const success = await dispatch(removeFromWishlist(productId));
    if (!success) {
      toast.error("Failed to remove item. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[60vh] bg-gray-100 dark:bg-gray-900 px-4 py-10">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-800 dark:text-white">
          My Wishlist
        </h1>

        {status === Status.LOADING && (
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-48 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        )}

        {status !== Status.LOADING && items.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Your wishlist is empty.
            </p>
            <Link
              to="/"
              className="mt-4 rounded-md bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <Link to={`/product/${item.productId}`}>
                  <img
                    src={getProductImageUrl(item.Product?.productImageUrl)}
                    alt={item.Product?.productName}
                    className="h-40 w-full object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-semibold text-gray-900 dark:text-white"
                    >
                      {item.Product?.productName}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      ${item.Product?.productPrice}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item.productId)}
                      className="flex-1 rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
