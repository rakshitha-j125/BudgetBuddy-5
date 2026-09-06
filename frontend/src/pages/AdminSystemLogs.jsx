import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  User,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import api from "../api/axios";

const AdminSystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await api.get(
          "/admin/system-logs/"
        );

        setLogs(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load system logs."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <Topbar />

        <main className="p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <FileText
                size={30}
                className="text-indigo-600"
              />

              <h1 className="text-3xl font-bold text-slate-900">
                System Logs
              </h1>
            </div>

            <p className="mt-2 text-slate-500">
              View BudgetBuddy system activity and logs.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-slate-500">
                Loading system logs...
              </p>
            </div>
          ) : logs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <FileText
                size={40}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-medium text-slate-600">
                No system logs available.
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
                        User
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Action
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Description
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Time
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-5 text-sm text-slate-600">
                          {log.id}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <User
                              size={16}
                              className="text-slate-400"
                            />

                            <span className="text-sm text-slate-600">
                              {log.user_id ?? "System"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                            {log.action}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {log.description || "-"}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock size={15} />

                            {new Date(
                              log.created_at
                            ).toLocaleString()}
                          </div>
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

export default AdminSystemLogs;