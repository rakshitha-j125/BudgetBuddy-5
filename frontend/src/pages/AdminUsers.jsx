import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import api from "../api/axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setError("");

      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (userId, role) => {
    try {
      await api.put(
        `/admin/users/${userId}/role`,
        null,
        {
          params: { role },
        }
      );

      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to update role."
      );
    }
  };

  const changeStatus = async (userId, isActive) => {
    try {
      await api.put(
        `/admin/users/${userId}/status`,
        null,
        {
          params: { is_active: isActive },
        }
      );

      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to update user status."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <Topbar />

        <main className="p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <Users
                size={30}
                className="text-indigo-600"
              />

              <h1 className="text-3xl font-bold text-slate-900">
                User Management
              </h1>
            </div>

            <p className="mt-2 text-slate-500">
              View and manage BudgetBuddy users.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-slate-500">
                Loading users...
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        ID
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Email
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Role
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-5 text-slate-600">
                          {user.id}
                        </td>

                        <td className="px-6 py-5 font-medium text-slate-900">
                          {user.email}
                        </td>

                        <td className="px-6 py-5">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              changeRole(
                                user.id,
                                e.target.value
                              )
                            }
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                          >
                            <option value="student">
                              Student
                            </option>

                            <option value="premium">
                              Premium
                            </option>

                            <option value="admin">
                              Admin
                            </option>
                          </select>
                        </td>

                        <td className="px-6 py-5">
                          {user.is_active ? (
                            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                              <UserCheck size={15} />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                              <UserX size={15} />
                              Inactive
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() =>
                              changeStatus(
                                user.id,
                                !user.is_active
                              )
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                              user.is_active
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {user.is_active
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;