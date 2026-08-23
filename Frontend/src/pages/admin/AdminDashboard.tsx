import { useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout.tsx";
import StatCard from "./components/StatCard.tsx";
import { fetchDashboardStats } from "../../store/adminSlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { stats } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <AdminLayout>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`Rs. ${(stats?.totalRevenue ?? 0).toLocaleString()}`}
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v-2m0-10a9 9 0 100 18 9 9 0 000-18z"
          accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
        />
        <StatCard
          label="Total Orders"
          value={String(stats?.totalOrders ?? 0)}
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          accent="bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
        />
        <StatCard
          label="Total Products"
          value={String(stats?.totalProducts ?? 0)}
          icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          accent="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
        />
        <StatCard
          label="Total Users"
          value={String(stats?.totalUsers ?? 0)}
          icon="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1a4 4 0 100-8 4 4 0 000 8zm6 3v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
          accent="bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400"
        />
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(stats?.recentOrders ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-slate-500 dark:text-slate-400"
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
              {(stats?.recentOrders ?? []).map((order) => (
                <tr key={order.id} className="text-slate-700 dark:text-slate-300">
                  <td className="px-5 py-3 font-mono text-xs">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-5 py-3">{order.User?.username ?? "-"}</td>
                  <td className="px-5 py-3">Rs. {order.totalAmount}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
