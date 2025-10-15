"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Trash2, Pencil, AlertTriangle, X } from "lucide-react";
import { authService } from "@/services/authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  id: number;
  fullname: string;
  username: string;
  role: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    fullname: "",
    username: "",
    role: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // ฟังก์ชันดึงข้อมูลผู้ใช้งาน
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = authService.getToken();

    if (!token) {
      setError("Token not found. Please login.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        setError(
          "Unauthorized. Session expired or invalid token. Redirecting to login..."
        );
        authService.logout();
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data.data || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ฟังก์ชันเปิด Modal แก้ไข
  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setEditForm({
      fullname: user.fullname,
      username: user.username,
      role: user.role,
    });
    setShowEditModal(true);
  };

  // ฟังก์ชันเรียก API สำหรับแก้ไขจริง
  const confirmEdit = async () => {
    if (!userToEdit) return;

    setIsUpdating(true);
    setError("");

    const token = authService.getToken();
    if (!token) {
      setError("Authorization token missing.");
      setIsUpdating(false);
      setShowEditModal(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/users/${userToEdit.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (res.status === 401) {
        setError("Unauthorized. Session expired. Redirecting...");
        authService.logout();
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Failed to update user ID: ${userToEdit.id}`
        );
      }

      // อัปเดตสำเร็จ: อัปเดตรายการผู้ใช้งาน
      setUsers(
        users.map((u) => (u.id === userToEdit.id ? { ...u, ...editForm } : u))
      );
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during update.");
    } finally {
      setIsUpdating(false);
      setShowEditModal(false);
      setUserToEdit(null);
    }
  };

  // ฟังก์ชันเปิด Modal ยืนยันการลบ
  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // ฟังก์ชันเรียก API สำหรับลบจริง
  const confirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    setError("");

    const token = authService.getToken();
    if (!token) {
      setError("Authorization token missing.");
      setIsDeleting(false);
      setShowDeleteModal(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/users/${userToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 401) {
        setError("Unauthorized. Session expired. Redirecting...");
        authService.logout();
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Failed to delete user ID: ${userToDelete.id}`
        );
      }

      // ลบสำเร็จ: อัปเดตรายการผู้ใช้งาน
      setUsers(users.filter((u) => u.id !== userToDelete.id));
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during deletion.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="">
      {/* Edit User Modal */}
      {showEditModal && userToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-blue-600 flex items-center">
                <Pencil className="w-6 h-6 mr-2" />
                Edit User
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={isUpdating}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.fullname}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullname: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isUpdating}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isUpdating}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isUpdating}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="USER">USER</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <Pencil className="w-4 h-4 mr-2" />
                )}
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-red-600 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Confirm Deletion
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
                disabled={isDeleting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 text-gray-700">
              <p>Are you sure you want to permanently delete the user:</p>
              <p className="font-semibold mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                {userToDelete.fullname} (Username: {userToDelete.username})
              </p>
              <p className="sm:text-sm text-gray-500 mt-2">
                This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Title และ Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            User Management
          </h1>
          <div className="flex items-center space-x-3">
            {/* <button
              onClick={() => router.push("/dashboard/users/createUsers")}
              className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center text-sm"
              disabled={loading || isDeleting || isUpdating}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </button> */}
          </div>
        </div>

        {loading && !error && (
          <div className="text-center p-8 text-gray-500 bg-white rounded-xl shadow-lg mt-4">
            <div className="animate-spin inline-block w-6 h-6 border-4 border-slate-500 border-t-transparent rounded-full mr-2"></div>
            Loading users...
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <p className="text-gray-500 text-center p-8 border rounded-lg bg-white shadow-lg mt-4">
            No users found.
          </p>
        )}

        {!loading && users.length > 0 && (
          <div className="mt-4 overflow-hidden shadow-2xl rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u, i) => (
                  <tr
                    key={u.id}
                    className="hover:bg-blue-50/50 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {i + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {u.fullname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {u.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.role.toLowerCase() === "admin"
                            ? "bg-red-100 text-red-800"
                            : u.role.toLowerCase() === "manager"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(u)}
                        title="Edit User"
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition"
                        disabled={isDeleting || isUpdating}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        title="Delete User"
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition"
                        disabled={isDeleting || isUpdating}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
