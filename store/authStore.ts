import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  token: string | null;
  message: string | null;
  type: string | null;
  role: string | null;
  user_id: number | null;
  isAuthenticated: boolean;
  setAuth: (authData: Partial<AuthState>) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      message: null,
      type: null,
      role: null,
      user_id: null,
      isAuthenticated: false,
      setAuth: (authData: Partial<AuthState>) => set({ ...authData, isAuthenticated: true }),
      logout: () =>
        set({
          token: null,
          message: null,
          type: null,
          role: null,
          user_id: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
