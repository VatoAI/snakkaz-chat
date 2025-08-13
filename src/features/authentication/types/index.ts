// 🚀 AUTHENTICATION TYPES
export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatar?: string;
  role: "user" | "admin" | "moderator";
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  acceptTerms: boolean;
}
