import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <DashboardLayout>
      <div className="rounded-2xl bg-white p-8 shadow">

        <h1 className="text-3xl font-bold">
          My Profile
        </h1>

        <div className="mt-8 space-y-4">

          <div>
            <p className="text-slate-500">Email</p>
            <h2 className="font-semibold">
              {user?.email}
            </h2>
          </div>

          <div>
            <p className="text-slate-500">Role</p>
            <h2 className="font-semibold">
              {user?.role}
            </h2>
          </div>

          <button
            onClick={logout}
            className="mt-8 rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700"
          >
            Logout
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;