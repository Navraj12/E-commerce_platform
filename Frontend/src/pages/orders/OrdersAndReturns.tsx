import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../../globals/components/navbar/Navbar.tsx";
import BasketSidebar from "../../globals/components/basketSidebar/BasketSidebar.tsx";
import { OrderStatus, type MyOrderData } from "../../globals/types/checkOutTypes.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";
import { fetchMyOrders } from "../../store/checkoutSlice.ts";

type TabId = "upcoming" | "past" | "returns";

const TABS: { id: TabId; label: string }[] = [
  { id: "upcoming", label: "Upcoming orders" },
  { id: "past", label: "Past orders" },
  { id: "returns", label: "Returns" },
];

// Terminal statuses count as "past"; everything else is still in progress ("upcoming").
const TERMINAL_STATUSES: OrderStatus[] = [
  OrderStatus.Delivered,
  OrderStatus.Cancelled,
];

const statusBadgeClasses = (status: OrderStatus | string) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "bg-green-100 text-green-800";
    case OrderStatus.Cancelled:
      return "bg-red-100 text-red-800";
    case OrderStatus.Ontheway:
      return "bg-blue-100 text-blue-800";
    case OrderStatus.Preparation:
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const EmptyState = ({
  message,
  supportingText,
  actionLabel,
  actionTo,
}: {
  message: string;
  supportingText: string;
  actionLabel: string;
  actionTo: string;
}) => (
  <div className="flex flex-col items-center rounded-xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
    <svg
      className="mb-4 h-16 w-16 text-gray-300"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8l-9-5-9 5 9 5 9-5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8v8l9 5 9-5V8"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 13v8" />
    </svg>
    <p className="text-base font-bold text-gray-900">{message}</p>
    <p className="mt-1 text-sm text-gray-500">{supportingText}</p>
    <Link
      to={actionTo}
      className="mt-5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      {actionLabel}
    </Link>
  </div>
);

const OrderCard = ({ order }: { order: MyOrderData }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-gray-900">
          Order #{order.id}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">
          Placed on {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold leading-tight ${statusBadgeClasses(
          order.orderStatus
        )}`}
      >
        {order.orderStatus}
      </span>
    </div>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
      <p className="text-sm text-gray-700">
        Total: <span className="font-semibold text-gray-900">Rs. {order.totalAmount}</span>
      </p>
      <Link
        to={`/myorders/${order.id}`}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        View details
      </Link>
    </div>
  </div>
);

const OrdersAndReturns = () => {
  const dispatch = useAppDispatch();
  const { myOrders } = useAppSelector((state) => state.orders);
  const { user } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState<TabId>("upcoming");

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (!token && !user?.token) {
    return <Navigate to="/login" replace />;
  }

  const upcomingOrders = myOrders.filter(
    (order) => !TERMINAL_STATUSES.includes(order.orderStatus)
  );
  const pastOrders = myOrders.filter((order) =>
    TERMINAL_STATUSES.includes(order.orderStatus)
  );

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 pb-12">
        <div className="container mx-auto px-4 py-6 sm:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Orders and returns
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            See your upcoming orders, past orders and your returns.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="mb-5 flex flex-wrap gap-2 border-b border-gray-200">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "upcoming" &&
                (upcomingOrders.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    message="You have no upcoming orders"
                    supportingText="Orders that are being prepared or are on their way will show up here."
                    actionLabel="Start shopping"
                    actionTo="/"
                  />
                ))}

              {activeTab === "past" &&
                (pastOrders.length > 0 ? (
                  <div className="space-y-4">
                    {pastOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    message="You have no past orders"
                    supportingText="Delivered or cancelled orders will appear here once you have some."
                    actionLabel="Start shopping"
                    actionTo="/"
                  />
                ))}

              {activeTab === "returns" && (
                <EmptyState
                  message="You have no returns"
                  supportingText="Returns aren't available yet — once you receive an order you'll be able to start a return here."
                  actionLabel="Start shopping"
                  actionTo="/"
                />
              )}
            </div>

            {/* Basket sidebar */}
            <div className="lg:col-span-1">
              <BasketSidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersAndReturns;
