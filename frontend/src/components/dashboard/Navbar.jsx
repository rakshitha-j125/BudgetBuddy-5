import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-5 shadow-sm">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="relative rounded-full p-2 transition hover:bg-slate-100"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={22} />

          {/* Notification indicator */}
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-blue-600" />
        </button>

        {/* User */}
        <div className="text-right">
          <h3 className="font-semibold text-slate-800">
            {user?.email || "Guest"}
          </h3>

          <p className="text-sm capitalize text-slate-500">
            {user?.role || "User"}
          </p>
        </div>

        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.email || "User"
          )}&background=4F46E5&color=ffffff`}
          alt="Profile"
          className="h-12 w-12 rounded-full"
        />
      </div>
    </header>
  );
};

export default Navbar;