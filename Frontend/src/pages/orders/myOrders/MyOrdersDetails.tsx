import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../../globals/components/navbar/Navbar.tsx";
import { OrderStatus } from "../../../globals/types/checkOutTypes.ts";
import { getProductImageUrl } from "../../../globals/utils/image.ts";
import {
  cancelMyOrder,
  fetchMyOrderDetails,
} from "../../../store/checkoutSlice.ts";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import { Status } from "../../../globals/types/types.ts";

const STATUS_STEPS = [
  { key: OrderStatus.Pending, label: "Pending" },
  { key: OrderStatus.Preparation, label: "Preparing" },
  { key: OrderStatus.Ontheway, label: "On the way" },
  { key: OrderStatus.Delivered, label: "Delivered" },
];

const OrderStatusStepper = ({ status }: { status: OrderStatus }) => {
  if (status === OrderStatus.Cancelled) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-4 py-1.5 text-sm font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">
        Order Cancelled
      </span>
    );
  }
  const currentIndex = STATUS_STEPS.findIndex((step) => step.key === status);
  return (
    <div className="flex w-full items-center">
      {STATUS_STEPS.map((step, index) => {
        const isDone = index <= currentIndex;
        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  isDone
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-1 text-[11px] font-medium ${
                  isDone
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STATUS_STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 ${
                  index < currentIndex
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const MyOrdersDetails = () => {
  const { id } = useParams();
  const { orderDetails } = useAppSelector((state) => state.orders);
  const { user } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (id) {
      dispatch(fetchMyOrderDetails(id));
    }
  }, [dispatch, id]);

  const handleCancelOrder = async () => {
    if (id) {
      const resultAction = await dispatch(cancelMyOrder(id));
      if (resultAction?.status === Status.ERROR) {
        toast.error("Failed to cancel order. Please try again.");
        return;
      }
      toast.success("Order cancelled successfully");
      await dispatch(fetchMyOrderDetails(id));
    }
  };

  if (!token && !user?.token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="py-1 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
        <div className="flex justify-start item-start space-y-5 flex-col">
          <h1 className="text-1xl dark:text-white lg:text-2xl font-semibold leading-7 lg:leading-9 text-gray-600">
            Order Details{" "}
          </h1>
          <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">
            {new Date(orderDetails[0]?.Order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {orderDetails.length > 0 && (
          <div className="mt-6 rounded-lg bg-gray-50 dark:bg-gray-800 p-6">
            <OrderStatusStepper status={orderDetails[0]?.Order?.orderStatus} />
          </div>
        )}
        <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
          <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
            <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
              <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
                My Order
              </p>

              {orderDetails.length > 0 &&
                orderDetails.map((order) => {
                  return (
                    <div
                      className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full"
                      key={order.Order.id}
                    >
                      <div className="pb-4 md:pb-8 w-full md:w-40">
                        <img
                          src={getProductImageUrl(order?.Product?.productImageUrl)}
                          className="h-[100px] w-[100px] rounded-md object-cover"
                          alt={order?.Product?.productName || "Product Image"}
                        />
                      </div>
                      <p className="text-base dark:text-white xl:text-lg leading-6">
                        {order.Product?.productName ?? "Product no longer available"}{" "}
                      </p>
                      <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                        <div className="w-full flex flex-col justify-start items-start space-y-8">
                          <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800"></h3>
                        </div>
                        <div className="flex justify-between space-x-8 items-start w-full">
                          <p className="text-base dark:text-white xl:text-lg leading-6">
                            {order.Product ? `Rs. ${order.Product.productPrice}` : "—"}{" "}
                          </p>
                          <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">
                            Qty: {order.quantity}
                          </p>
                          <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">
                            {order.Product
                              ? `Rs. ${order.Product.productPrice * order.quantity}`
                              : "—"}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
              <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                  Summary
                </h3>
                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base dark:text-white leading-4 text-gray-800">
                      Payment Method
                    </p>
                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                      {orderDetails[0]?.Order?.Payment?.paymentMethod}
                    </p>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base dark:text-white leading-4 text-gray-800">
                      Payment Status
                    </p>
                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                      {orderDetails[0]?.Order?.Payment?.paymentStatus}
                    </p>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base dark:text-white leading-4 text-gray-800">
                      Order Status
                    </p>
                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                      {orderDetails[0]?.Order?.orderStatus}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">
                    Total
                  </p>
                  <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">
                    {orderDetails[0]?.Order?.totalAmount}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                  Shipping
                </h3>
                <div className="flex justify-between items-start w-full">
                  <div className="flex justify-center items-center space-x-4">
                    <div className="w-8 h-8">
                      <img
                        className="w-full h-full"
                        alt="logo"
                        src="https://i.ibb.co/L8KSdNQ/image-3.png"
                      />
                    </div>
                    <div className="flex flex-col justify-start items-center">
                      <p className="text-lg leading-6 dark:text-white font-semibold text-gray-800">
                        Delivery Charge
                        <br />
                        <span className="font-normal">
                          Delivery with 24 Hours
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold leading-6 dark:text-white text-gray-800">
                    Rs 100
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-2 md:p-1 xl:p-8 flex-col"
              style={{ height: "300px" }}
            >
              <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                Customer
              </h3>
              <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                  <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                    <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                      <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                        Address : {orderDetails[0]?.Order.shippingAddress}{" "}
                      </p>
                      <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                        Phone : {orderDetails[0]?.Order.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                    <>
                      {orderDetails[0]?.Order?.orderStatus !==
                        OrderStatus.Cancelled && (
                        <button
                          className="mt-6 md:mt-0 dark:border-white dark:hover:bg-gray-900 dark:bg-transparent dark:text-white py-3 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 w-96 2xl:w-full text-base font-medium leading-4 text-gray-800"
                          style={{ marginTop: "10px" }}
                          onClick={handleCancelOrder}
                        >
                          Cancel Order
                        </button>
                      )}
                    </>
                  </div>
                  {/* 
            <div className="flex w-full justify-center items-center md:justify-start md:items-start">
              <button className="mt-6 md:mt-0 dark:border-white dark:hover:bg-gray-900 dark:bg-transparent dark:text-white py-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 font-medium w-96 2xl:w-full text-base font-medium leading-4 text-gray-800" style={{marginTop:'10px',backgroundColor:'red',color:'white'}}>Delete Order</button>
  
            </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrdersDetails;
