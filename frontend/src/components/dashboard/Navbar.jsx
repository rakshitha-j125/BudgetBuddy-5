import { Bell, Search } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between bg-white px-8 py-5 shadow">

      <div className="relative w-96">

        <Search
          size={18}
          className="absolute left-4 top-3 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:border-indigo-600"
        />

      </div>

      <div className="flex items-center gap-6">

        <button>

          <Bell size={22} />

        </button>

        <div className="text-right">

          <h3 className="font-semibold">
            {user?.email}
          </h3>

          <p className="text-sm text-slate-500">
            {user?.role}
          </p>

        </div>

        <img
          src="https://ui-avatars.com/api/?name=User"
          alt=""
          className="h-12 w-12 rounded-full"
        />

      </div>

    </header>
  );
};

export default Navbar;