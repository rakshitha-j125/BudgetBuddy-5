import { useEffect, useState } from "react";
import {
  Check,
  X,
  Clock,
  Crown,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import api from "../api/axios";

const AdminPremiumRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const loadRequests = async () => {
    try {
      setError("");

      const response = await api.get("/premium-requests/");
      setRequests(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load Premium requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      setActionLoading(requestId);
      setError("");

      await api.put(
        `/premium-requests/${requestId}/${action}`
      );

      await loadRequests();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          `Unable to ${action} request.`
      );
    } finally {
      setActionLoading(null);
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
              <Crown className="text-indigo-600" size={30} />

              <h1 className="text-3xl font-bold text-slate-900">
                Premium Requests
              </h1>
            </div>

            <p className="mt-2 text-slate-500">
              Review and manage user Premium access requests.
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
                Loading requests...
              </p>
            </div>
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Crown
                size={40}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 font-medium text-slate-600">
                No Premium requests found.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        User
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Requested
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {requests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-5">
                          <p className="font-medium text-slate-900">
                            {request.user_email}
                          </p>

                          <p className="text-sm text-slate-400">
                            User ID: {request.user_id}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {new Date(
                            request.requested_at
                          ).toLocaleString()}
                        </td>

                        <td className="px-6 py-5">
                          {request.status === "pending" && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                              <Clock size={15} />
                              Pending
                            </span>
                          )}

                          {request.status === "approved" && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                              <Check size={15} />
                              Approved
                            </span>
                          )}

                          {request.status === "rejected" && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                              <X size={15} />
                              Rejected
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5 text-right">
                          {request.status === "pending" && (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  handleAction(
                                    request.id,
                                    "approve"
                                  )
                                }
                                disabled={
                                  actionLoading === request.id
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                              >
                                <Check size={16} />
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  handleAction(
                                    request.id,
                                    "reject"
                                  )
                                }
                                disabled={
                                  actionLoading === request.id
                                }
                                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                              >
                                <X size={16} />
                                Reject
                              </button>
                            </div>
                          )}

                          {request.status !== "pending" && (
                            <span className="text-sm text-slate-400">
                              Reviewed
                            </span>
                          )}
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

export default AdminPremiumRequests;