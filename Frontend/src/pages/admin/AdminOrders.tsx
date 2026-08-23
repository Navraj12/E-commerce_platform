import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout.tsx";
import { OrderStatus } from "../../globals/types/checkOutTypes.ts";
import { fetchAllOrders, updateOrderStatus } from "../../store/adminSlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";

const statusOptions = [
  OrderStatus.Pending,
  OrderStatus.Preparation,
  OrderStatus.Ontheway,
  OrderStatus.Delivered,
  OrderStatus.Cancelled,
];

const statusBadgeClasses = (status: string) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
    case OrderStatus.Cancelled:
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
    case OrderStatus.Ontheway:
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    case OrderStatus.Preparation:
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }
};

const AdminOrders = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.admin);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId: string, status: string) => {
    const success = await dispatch(
      updateOrderStatus(orderId, status as OrderStatus)
    );
    if (success) {
      toast.success("Order status updated");
    } else {
      toast.error("Failed to update order status");
    }
  };

  return (
    <AdminLayout>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
        Orders
      </h1>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
              <th className="px-5 py-3">Order ID</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Payment</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-8 text-center text-slate-500 dark:text-slate-400"
                >
                  No orders found.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr className="text-slate-700 dark:text-slate-300">
                  <td className="px-5 py-3 font-mono text-xs">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-5 py-3">
                    <div>{order.User?.username ?? "-"}</div>
                    <div className="text-xs text-slate-400">
                      {order.User?.email ?? ""}
                    </div>
                  </td>
                  <td className="px-5 py-3">Rs. {order.totalAmount}</td>
                  <td className="px-5 py-3 capitalize">
                    {order.Payment?.paymentMethod} / {order.Payment?.paymentStatus}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium capitalize outline-none ${statusBadgeClasses(
                        order.orderStatus
                      )}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === order.id ? null : order.id)
                      }
                      className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {expandedId === order.id ? "Hide" : "Details"}
                    </button>
                  </td>
                </tr>
                {expandedId === order.id && (
                  <tr>
                    <td colSpan={7} className="bg-slate-50 px-5 py-4 dark:bg-slate-800/50">
                      <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                        <div>
                          <span className="font-semibold">Phone: </span>
                          {order.phoneNumber}
                        </div>
                        <div>
                          <span className="font-semibold">Shipping Address: </span>
                          {order.shippingAddress}
                        </div>
                        <div>
                          <span className="font-semibold">Order ID: </span>
                          {order.id}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
