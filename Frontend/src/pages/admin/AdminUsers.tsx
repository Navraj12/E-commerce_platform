import { useEffect } from "react";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout.tsx";
import {
  deleteUserById,
  fetchAllUsers,
  updateUserRole,
} from "../../store/adminSlice.ts";
import { useAppDispatch, useAppSelector } from "../../store/hooks.ts";

const AdminUsers = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.admin);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleRoleToggle = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "customer" : "admin";
    const success = await dispatch(updateUserRole(id, newRole));
    if (success) {
      toast.success(`Role updated to ${newRole}`);
    } else {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    const success = await dispatch(deleteUserById(id));
    if (success) {
      toast.success("User deleted");
    } else {
      toast.error("Failed to delete user");
    }
  };

  return (
    <AdminLayout>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
        Users
      </h1>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
              <th className="px-5 py-3">Username</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-slate-500 dark:text-slate-400"
                >
                  No users found.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="text-slate-700 dark:text-slate-300">
                <td className="px-5 py-3">{u.username}</td>
                <td className="px-5 py-3">{u.email}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      u.role === "admin"
                        ? "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRoleToggle(u.id, u.role)}
                      disabled={u.id === currentUser?.id}
                      className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Make {u.role === "admin" ? "Customer" : "Admin"}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={u.id === currentUser?.id}
                      className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900 dark:hover:bg-red-950"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
