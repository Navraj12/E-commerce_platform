import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../globals/components/navbar/Navbar.tsx";
import {
  type ItemDetails,
  type OrderData,
  PaymentMethod,
} from "../../globals/types/checkOutTypes.ts";
import { Status } from "../../globals/types/types.ts";
import { getProductImageUrl } from "../../globals/utils/image.ts";
import { API } from "../../http/index.ts";
import { clearCartItems } from "../../store/cartSlice.ts";
import { orderItem } from "../../store/checkoutSlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";

const Checkout = () => {
  const { items } = useAppSelector((state) => state.carts);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.COD
  );
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [coupon, setCoupon] = useState<{
    code: string;
    discountPercent: number;
    discountAmount: number;
  } | null>(null);
  const [data, setData] = useState<OrderData>({
    phoneNumber: "",
    shippingAddress: "",
    totalAmount: 0,
    PaymentDetails: {
      paymentMethod: PaymentMethod.COD,
    },
    items: [],
  });

  const handlePaymentMethod = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value as PaymentMethod);
    setData({
      ...data,
      PaymentDetails: {
        paymentMethod: e.target.value as PaymentMethod,
      },
    });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const subtotal = items.reduce(
    (total, item) => item.Product.productPrice * item.quantity + total,
    0
  );
  const shipping = 100;
  const discountAmount = coupon?.discountAmount ?? 0;
  const total = Math.max(subtotal + shipping - discountAmount, 0);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    try {
      const response = await API.post("/coupon/apply", {
        code: couponCode,
        totalAmount: subtotal + shipping,
      });
      const result = response.data.data;
      setCoupon({
        code: result.code,
        discountPercent: result.discountPercent,
        discountAmount: result.discountAmount,
      });
      toast.success(`Coupon applied: ${result.discountPercent}% off`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setCoupon(null);
      toast.error(error?.response?.data?.message ?? "Invalid coupon code");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) return;
    const itemDetails: ItemDetails[] = items.map((item) => {
      return {
        productId: item.Product.id,
        quantity: item.quantity,
      };
    });

    const orderData = {
      ...data,
      items: itemDetails,
      totalAmount: total,
    };
    setIsPlacingOrder(true);
    const result = await dispatch(orderItem(orderData));
    if (result.status === Status.SUCCESS) {
      if (result.khaltiUrl) {
        window.location.href = result.khaltiUrl;
      } else {
        dispatch(clearCartItems());
        toast.success("Order placed successfully");
        navigate("/");
      }
    } else {
      setIsPlacingOrder(false);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center border-b bg-white mt-[-100px] py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
        <div className="mt-4 py-7 text-xs sm:mt-0 sm:ml-auto sm:text-base"></div>
      </div>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400">
            Check your items. And select a suitable shipping method.
          </p>
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            {items.length > 0 &&
              items.map((item) => {
                return (
                  <div
                    key={item?.Product?.id}
                    className="flex flex-col rounded-lg bg-white sm:flex-row"
                  >
                    <img
                      className="m-2 h-24 w-24 rounded-md border object-cover object-center"
                      alt={item?.Product?.productName || "Product Image"}
                      src={getProductImageUrl(item?.Product?.productImageUrl)}
                    />
                    <div className="flex w-full flex-col px-4 py-4">
                      <span className="font-semibold">
                        {item?.Product?.productName}
                      </span>
                      <span className="float-right text-gray-400">
                        Qty :{item?.quantity}{" "}
                      </span>
                      <p className="text-lg font-bold">
                        Rs. {item?.Product?.productPrice}{" "}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>

          <p className="mt-8 text-lg font-medium">Payment Methods</p>
          <form className="mt-5 grid gap-6">
            <div className="relative">
              <input
                className="peer hidden"
                id="radio_1"
                type="radio"
                name="radio"
                value={PaymentMethod.COD}
                onChange={handlePaymentMethod}
              />
              <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                htmlFor="radio_1"
              >
                <img
                  className="w-14 object-contain"
                  src="/images/nao.png"
                  alt=""
                />
                <div className="ml-5">
                  <span className="mt-2 font-semibold">
                    COD(Cash On Delivery)
                  </span>
                </div>
              </label>
            </div>
            <div className="relative">
              <input
                className="peer hidden"
                id="radio_2"
                type="radio"
                value={PaymentMethod.Khalti}
                onChange={handlePaymentMethod}
                name="radio"
              />
              <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                htmlFor="radio_2"
              >
                <img
                  src="/images/khalti-logo.png"
                  className="h-[40px] object-contain"
                  alt="Khalti"
                />

                <div className="ml-5">
                  <span className="mt-2 font-semibold">Online(Khalti)</span>
                </div>
              </label>
            </div>
          </form>
        </div>
        <form noValidate onSubmit={handleSubmit}>
          <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
            <p className="text-xl font-medium">Payment Details</p>
            <p className="text-gray-400">
              Complete your order by providing your payment details.
            </p>
            <div className="">
              <label
                htmlFor="phoneNumber"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  required
                  pattern="[0-9]{10}"
                  title="Enter a 10-digit phone number"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  onChange={handleChange}
                  placeholder="Your Phone Number"
                />
              </div>

              <label
                htmlFor="billing-address"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Shipping Address
              </label>
              <div className="flex flex-col sm:flex-row">
                <div className="relative flex-shrink-0 sm:w-7/12">
                  <input
                    type="text"
                    id="billing-address"
                    name="shippingAddress"
                    required
                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Street Address"
                    onChange={handleChange}
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                    <img
                      className="h-4 w-4 object-contain"
                      src="https://flagpack.xyz/_nuxt/4c829b6c0131de7162790d2f897a90fd.svg"
                      alt=""
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="coupon"
                  className="mb-2 block text-sm font-medium"
                >
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    id="coupon"
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full rounded-md border border-gray-200 px-4 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode}
                    className="shrink-0 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    {applyingCoupon ? "Applying..." : "Apply"}
                  </button>
                </div>
                {coupon && (
                  <p className="mt-2 text-sm text-green-600">
                    "{coupon.code}" applied — {coupon.discountPercent}% off
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-b py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Subtotal</p>
                  <p className="font-semibold text-gray-900">Rs {subtotal}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Shipping</p>
                  <p className="font-semibold text-gray-900">Rs {shipping}</p>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-green-600">
                      Discount
                    </p>
                    <p className="font-semibold text-green-600">
                      - Rs {discountAmount.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  Rs {total.toFixed(2)}
                </p>
              </div>
            </div>

            {paymentMethod === PaymentMethod.Khalti ? (
              <button
                type="submit"
                disabled={isPlacingOrder || items.length === 0}
                className="mt-4 mb-8 w-full rounded-md bg-purple-700 px-6 py-3 font-medium text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPlacingOrder ? "Processing..." : "Pay With Khalti"}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPlacingOrder || items.length === 0}
                className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Checkout;
