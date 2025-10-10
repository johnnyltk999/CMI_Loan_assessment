// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { LogOut, User as UserIcon } from "lucide-react";

// export default function DashboardPage() {
//   const { user, logout, loading } = useAuth();
//   const router = useRouter();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   const handleLogout = async () => {
//     await logout();
//     router.push("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             <div className="flex items-center">
//               <h1 className="text-xl font-semibold text-gray-800">
//                 CMI Loan Assessment
//               </h1>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <UserIcon className="w-5 h-5 text-gray-600" />
//                 <div>
//                   <p className="text-sm font-medium text-gray-800">
//                     {user?.fullname}
//                   </p>
//                   <p className="text-xs text-gray-500">{user?.role}</p>
//                 </div>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
//               >
//                 <LogOut className="w-4 h-4" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">
//             Welcome back, {user?.fullname}!
//           </h2>
//           <a href="/dashboard/users">
//             <div className="mb-6 justify-end flex">
//               <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer">
//                 <UserIcon className="w-4 h-4" />
//                 Users
//               </button>
//             </div>
//           </a>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="border rounded-lg p-4">
//               <p className="text-sm text-gray-600">Username</p>
//               <p className="text-lg font-semibold text-gray-800">
//                 {user?.username}
//               </p>
//             </div>
//             <div className="border rounded-lg p-4">
//               <p className="text-sm text-gray-600">Role</p>
//               <p className="text-lg font-semibold text-gray-800">
//                 {user?.role}
//               </p>
//             </div>
//             <div className="border rounded-lg p-4">
//               <p className="text-sm text-gray-600">User ID</p>
//               <p className="text-lg font-semibold text-gray-800">{user?.id}</p>
//             </div>
//             <div></div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div>Loading...</div>
  //     </div>
  //   );
  // }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome back, {user?.fullname}!
          </h2>
          <a href="/dashboard/users">
            <div className="mb-6 justify-end flex">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer">
                <UserIcon className="w-4 h-4" />
                Users
              </button>
            </div>
          </a>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">Username</p>
              <p className="text-lg font-semibold text-gray-800">
                {user?.username}
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-lg font-semibold text-gray-800">
                {user?.role}
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">User ID</p>
              <p className="text-lg font-semibold text-gray-800">{user?.id}</p>
            </div>
            <div></div>
          </div>
        </div>
      </main>
    </div>
  );
}
