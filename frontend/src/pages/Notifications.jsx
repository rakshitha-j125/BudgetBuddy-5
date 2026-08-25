import { useEffect, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const response = await api.get("/notifications/");
      setNotifications(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const removeNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((current) =>
        current.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8 shadow-md">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3">
            <Bell className="text-blue-600" size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Notifications
            </h1>
            <p className="mt-1 text-slate-500">
              Stay updated about your finances.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            No notifications yet.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl border p-5 ${
                  notification.is_read
                    ? "border-slate-200 bg-white"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      {notification.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(
                        notification.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {!notification.is_read && (
                      <button
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                        className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    )}

                    <button
                      onClick={() =>
                        removeNotification(notification.id)
                      }
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;