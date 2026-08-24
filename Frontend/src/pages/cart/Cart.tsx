import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../globals/components/navbar/Navbar.tsx";
import { deleteCartItem, updateCartItem } from "../../store/cartSlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { getProductImageUrl } from "../../globals/utils/image.ts";

const Cart = () => {
  const { items } = useAppSelector((state) => state.carts);
  const dispatch = useAppDispatch();
  const handleDelete = async (productId: string) => {
    const success = await dispatch(deleteCartItem(productId));
    if (!success) {
      toast.error("Failed to remove item. Please try again.");
    }
  };

  const handleUpdate = async (productId: string, quantity: number) => {
    if (!Number.isFinite(quantity) || quantity < 1) return;
    const success = await dispatch(updateCartItem(productId, quantity));
    if (!success) {
      toast.error("Failed to update quantity. Please try again.");
    }
  };

  const totalItemInCarts = Array.isArray(items)
    ? items.reduce((total, item) => total + (item.quantity || 0), 0)
    : 0;
  const totalPriceInCarts = Array.isArray(items)
    ? items.reduce(
        (total, item) =>
          total + (item?.Product?.productPrice || 0) * (item.quantity || 0),
        0
      )
    : 0;
  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Your cart is empty
          </h1>
          <p className="mt-2 text-gray-500">
            Looks like you haven&apos;t added anything yet.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-md bg-blue-500 px-6 py-2.5 font-medium text-white hover:bg-blue-600"
          >
            Continue Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 pt-10 pb-16">
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">
            {items.length > 0 &&
              items.map((item) => {
                return (
                  <div
                    className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                    key={item.id || item.Product?.id || item.productId}
                  >
                    <img
                      className="h-[100px] w-[100px] rounded-md object-cover"
                      alt={item?.Product?.productName || "Product Image"}
                      src={getProductImageUrl(item?.Product?.productImageUrl)}
                    />

                    <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                      <div className="mt-5 sm:mt-0">
                        <h2 className="text-lg font-bold text-gray-900">
                          {item?.Product?.productName}
                        </h2>
                        <p className="mt-1 text-xs text-gray-700">
                          {item?.Product?.Category?.categoryName}
                        </p>
                      </div>
                      <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                        <div className="flex items-center border-gray-100">
                          <span
                            className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                            onClick={() =>
                              handleUpdate(
                                item?.Product?.id,
                                item?.quantity - 1
                              )
                            }
                          >
                            {" "}
                            -{" "}
                          </span>
                          <input
                            className="h-8 w-8 border bg-white text-center text-xs outline-none"
                            type="number"
                            value={item.quantity}
                            min={1}
                            onChange={(e) =>
                              handleUpdate(
                                item?.Product?.id,
                                Number(e.target.value)
                              )
                            }
                          />
                          <span
                            className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                            onClick={() =>
                              handleUpdate(
                                item?.Product?.id,
                                item?.quantity + 1
                              )
                            }
                          >
                            {" "}
                            +{" "}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="text-sm">
                            Rs. {item?.Product?.productPrice}
                          </p>
                          <div
                            className="cursor-pointer"
                            title="Remove item"
                            onClick={() => handleDelete(item?.Product?.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
            <div className="mb-2 flex justify-between">
              <p className="text-gray-700">Total Items</p>
              <p className="text-gray-700">{totalItemInCarts}</p>
            </div>
            <div className="mb-2 flex justify-between">
              <p className="text-gray-700">Subtotal</p>
              <p className="text-gray-700">Rs.{totalPriceInCarts}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700">Shipping</p>
              <p className="text-gray-700">Rs 100</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
              <p className="text-lg font-bold">Total</p>
              <div className="">
                <p className="mb-1 text-lg font-bold">
                  Rs. {totalPriceInCarts + 100}
                </p>
                <p className="text-sm text-gray-700">including VAT</p>
              </div>
            </div>
            <Link to="/checkout">
              <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
                Check out
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
