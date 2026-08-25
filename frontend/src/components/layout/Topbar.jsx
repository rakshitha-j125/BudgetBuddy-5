import { useEffect, useRef, useState } from "react";
import { Bell, UserCircle, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function Topbar() {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const notificationRef = useRef(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notifications/");

      setNotifications(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const handleToggle = async () => {
    const nextState = !open;

    setOpen(nextState);

    if (nextState) {
      await loadNotifications();
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(
        `/notifications/${notificationId}/read`
      );

      await loadNotifications();
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-8 backdrop-blur">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Welcome back
          {user?.full_name
            ? `, ${user.full_name}`
            : ""}
        </h2>

        <p className="text-sm text-slate-500">
          Here's your financial overview.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div
          ref={notificationRef}
          className="relative"
        >
          <button
            type="button"
            onClick={handleToggle}
            className="relative rounded-full p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-14 z-50 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-200 px-5 py-4">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Notifications
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${
                          unreadCount === 1
                            ? ""
                            : "s"
                        }`
                      : "You're all caught up"}
                  </p>
                </div>
              </div>

              <div className="max-h-[420px] overflow-y-auto">
                {loading ? (
                  <div className="px-5 py-10 text-center text-sm text-slate-500">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center px-5 py-12 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <Bell
                        size={22}
                        className="text-slate-400"
                      />
                    </div>

                    <p className="font-medium text-slate-700">
                      No notifications
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      New alerts will appear here.
                    </p>
                  </div>
                ) : (
                  notifications.map(
                    (notification) => (
                      <div
                        key={notification.id}
                        className={`border-b border-slate-100 px-5 py-4 transition hover:bg-slate-50 ${
                          !notification.is_read
                            ? "bg-blue-50/50"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
                            <Bell
                              size={17}
                              className="text-blue-600"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-slate-900">
                                {notification.title ||
                                  "Notification"}
                              </p>

                              {!notification.is_read && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                              )}
                            </div>

                            <p className="mt-1 text-sm leading-5 text-slate-600">
                              {notification.message ||
                                ""}
                            </p>

                            {notification.created_at && (
                              <p className="mt-2 text-xs text-slate-400">
                                {new Date(
                                  notification.created_at
                                ).toLocaleString()}
                              </p>
                            )}

                            {!notification.is_read && (
                              <button
                                type="button"
                                onClick={() =>
                                  markAsRead(
                                    notification.id
                                  )
                                }
                                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                              >
                                <Check size={13} />
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <UserCircle
            size={36}
            className="text-slate-400"
          />

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.full_name ||
                "BudgetBuddy User"}
            </p>

            <p className="text-xs text-slate-500">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}