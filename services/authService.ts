import type {
  LoginRequest,
  LoginResponse,
  ApiResponse,
  User,
} from "../types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://ec2-54-251-49-141.ap-southeast-1.compute.amazonaws.com";

export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token to cookie
      if (data.data?.token) {
        document.cookie = `token=${data.data.token}; path=/; max-age=86400; secure; samesite=strict`;
      }

      return data;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Invalid username or password");
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const token = this.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get user profile");
      }

      return data;
    } catch (error: any) {
      console.error("Get user error:", error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    // Remove token from cookie
    document.cookie = "token=; path=/; max-age=0";
  },

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<any>> {
    const token = this.getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/users/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      return data;
    } catch (error: any) {
      console.error("Change password error:", error);
      throw error;
    }
  },

  /**
   * Get token from cookie
   */
  getToken(): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/token=([^;]+)/);
    return match ? match[1] : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
