export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: string;
  fullname: string;
  username: string;
  role: "ADMIN" | "MANAGER" | "USER";
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
