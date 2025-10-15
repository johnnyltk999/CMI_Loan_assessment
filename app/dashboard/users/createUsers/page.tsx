// "use client";
// import React, { use, useState } from "react";
// import { UserPlus, Eye, EyeOff, Save, X } from "lucide-react";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// interface CreateUserFormData {
//   fullname: string;
//   username: string;
//   password: string;
//   role: "USER" | "MANAGER" | "ADMIN";
// }

// interface FormErrors {
//   fullname?: string;
//   username?: string;
//   password?: string;
//   general?: string;
// }

// export default function CreateUserForm() {
//   const [formData, setFormData] = useState<CreateUserFormData>({
//     fullname: "",
//     username: "",
//     password: "",
//     role: "USER",
//   });

//   const [errors, setErrors] = useState<FormErrors>({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};

//     // Fullname validation
//     if (!formData.fullname.trim()) {
//       newErrors.fullname = "Full name is required";
//     } else if (formData.fullname.trim().length < 3) {
//       newErrors.fullname = "Full name must be at least 3 characters";
//     }

//     // Username validation
//     if (!formData.username.trim()) {
//       newErrors.username = "Username is required";
//     } else if (formData.username.trim().length < 3) {
//       newErrors.username = "Username must be at least 3 characters";
//     } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
//       newErrors.username =
//         "Username can only contain letters, numbers, and underscores";
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     } else if (
//       !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)
//     ) {
//       newErrors.password =
//         "Password must contain uppercase, lowercase, number, and special character";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});
//     setSuccess(false);

//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Get token from cookie
//       const token = document.cookie.match(/token=([^;]+)/)?.[1];

//       if (!token) {
//         throw new Error("No authentication token found. Please login again.");
//       }

//       const response = await fetch(
//         `
//         ${API_BASE_URL}/api/v1/users`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             fullname: formData.fullname,
//             username: formData.username,
//             password: formData.password,
//             role: formData.role,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to create user");
//       }

//       // Success
//       setSuccess(true);
//       setFormData({
//         fullname: "",
//         username: "",
//         password: "",
//         role: "USER",
//       });

//       setTimeout(() => setSuccess(false), 5000);
//     } catch (error: any) {
//       setErrors({ general: error.message || "Failed to create user" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       fullname: "",
//       username: "",
//       password: "",
//       role: "USER",
//     });
//     setErrors({});
//     setSuccess(false);
//   };

//   return (
//     <div className=" bg-gray-50 ">
//       <div className="max-w-2xl mx-auto">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
//             <div className="flex items-center justify-center gap-3 text-white">
//               <UserPlus className="w-8 h-8" />
//               <h1 className="text-2xl font-bold">Create New User</h1>
//             </div>
//             <p className="text-center text-blue-100 mt-2">
//               Add a new user to the system
//             </p>
//           </div>

//           <div className="p-6 md:p-8">
//             {/* Success Message */}
//             {success && (
//               <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
//                 <p className="text-green-800 font-medium">
//                   ✓ User created successfully!
//                 </p>
//               </div>
//             )}

//             {/* General Error */}
//             {errors.general && (
//               <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
//                 <p className="text-red-600 text-sm">{errors.general}</p>
//               </div>
//             )}

//             <div className="space-y-6">
//               {/* Full Name */}
//               <div>
//                 <label
//                   htmlFor="fullname"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   id="fullname"
//                   type="text"
//                   value={formData.fullname}
//                   onChange={(e) =>
//                     setFormData({ ...formData, fullname: e.target.value })
//                   }
//                   className={`w-full px-4 py-3 border ${
//                     errors.fullname ? "border-red-500" : "border-gray-300"
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
//                   placeholder="John Doe"
//                   disabled={isLoading}
//                 />
//                 {errors.fullname && (
//                   <p className="mt-2 text-sm text-red-600">{errors.fullname}</p>
//                 )}
//               </div>

//               {/* Username */}
//               <div>
//                 <label
//                   htmlFor="username"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Username <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   id="username"
//                   type="text"
//                   value={formData.username}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       username: e.target.value.toLowerCase(),
//                     })
//                   }
//                   className={`w-full px-4 py-3 border ${
//                     errors.username ? "border-red-500" : "border-gray-300"
//                   } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
//                   placeholder="johndoe"
//                   disabled={isLoading}
//                 />
//                 {errors.username && (
//                   <p className="mt-2 text-sm text-red-600">{errors.username}</p>
//                 )}
//               </div>

//               {/* Role */}
//               <div>
//                 <label
//                   htmlFor="role"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Role <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   id="role"
//                   value={formData.role}
//                   onChange={(e) =>
//                     setFormData({ ...formData, role: e.target.value as any })
//                   }
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
//                   disabled={isLoading}
//                 >
//                   <option value="USER">User</option>
//                   <option value="MANAGER">Manager</option>
//                   <option value="ADMIN">Admin</option>
//                 </select>
//                 <p className="mt-2 text-xs text-gray-500">
//                   {formData.role === "ADMIN" && "Full system access"}
//                   {formData.role === "MANAGER" && "Can manage users and loans"}
//                   {formData.role === "USER" && "Basic user access"}
//                 </p>
//               </div>

//               {/* Password */}
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Password <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     value={formData.password}
//                     onChange={(e) =>
//                       setFormData({ ...formData, password: e.target.value })
//                     }
//                     className={`w-full px-4 py-3 pr-12 border ${
//                       errors.password ? "border-red-500" : "border-gray-300"
//                     } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
//                     placeholder="Enter strong password"
//                     disabled={isLoading}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="mt-2 text-sm text-red-600">{errors.password}</p>
//                 )}
//                 <p className="mt-2 text-xs text-gray-500">
//                   Min 8 characters with uppercase, lowercase, number & special
//                   character
//                 </p>
//               </div>

//               {/* Buttons */}
//               <div className="flex gap-4 pt-4">
//                 <button
//                   onClick={handleSubmit}
//                   disabled={isLoading}
//                   className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {isLoading ? (
//                     <>
//                       <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                           fill="none"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         />
//                       </svg>
//                       Creating...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-5 h-5" />
//                       Create User
//                     </>
//                   )}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleReset}
//                   disabled={isLoading}
//                   className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   <X className="w-5 h-5" />
//                   Reset
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";
import { UserPlus, Eye, EyeOff, Save, X } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface CreateUserFormData {
  fullname: string;
  username: string;
  password: string;
  role: "USER" | "MANAGER" | "ADMIN";
}

interface FormErrors {
  fullname?: string;
  username?: string;
  password?: string;
  general?: string;
}

export default function CreateUserForm() {
  const [formData, setFormData] = useState<CreateUserFormData>({
    fullname: "",
    username: "",
    password: "",
    role: "USER",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    } else if (formData.fullname.trim().length < 3) {
      newErrors.fullname = "Full name must be at least 3 characters";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, and special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = document.cookie.match(/token=([^;]+)/)?.[1];

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          username: formData.username,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      setSuccess(true);
      setFormData({
        fullname: "",
        username: "",
        password: "",
        role: "USER",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to create user" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullname: "",
      username: "",
      password: "",
      role: "USER",
    });
    setErrors({});
    setSuccess(false);
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-gray-900 mb-1">
            <UserPlus className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Create New User</h1>
          </div>
          <p className="text-gray-600 text-sm">Add a new user to the system</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm font-medium">
              ✓ User created successfully!
            </p>
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
                className={`w-full px-3 py-2 border ${
                  errors.fullname ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
                placeholder="John Doe"
                disabled={isLoading}
              />
              {errors.fullname && (
                <p className="mt-1 text-xs text-red-600">{errors.fullname}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value.toLowerCase(),
                  })
                }
                className={`w-full px-3 py-2 border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
                placeholder="johndoe"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`w-full px-3 py-2 pr-10 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
                  placeholder="Enter password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                disabled={isLoading}
              >
                <option value="USER">User</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create User
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
