"use client";

import { useAuth } from "@/context/AuthContext";

import { useRouter } from "next/navigation";

import { LogOut, User as UserIcon } from "lucide-react";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();

  const router = useRouter();

  //   if (loading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center">
  //         <div>Loading...</div>
  //       </div>
  //     );
  //   }

  const handleLogout = async () => {
    await logout();

    router.push("/login");
  };

  return (
    <div className="bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              {/* <h1 className="text-xl font-semibold text-gray-800">
                CMI Loan Assessment
              </h1> */}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {user?.fullname}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
