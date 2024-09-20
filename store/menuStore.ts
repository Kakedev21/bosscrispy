import { create } from "zustand";
import { menuAPI } from "@/api/routes";
import { MenuItemType } from "@/typescript/menus";

interface MenuState {
  menuItems: MenuItemType[];
  isLoading: boolean;
  error: string | null;
  fetchMenuItems: () => Promise<void>;
}

const useMenuStore = create<MenuState>((set) => ({
  menuItems: [],
  isLoading: false,
  error: null,
  fetchMenuItems: async () => {
    set({ isLoading: true });
    try {
      const response = await menuAPI.getMenus();
      set({ menuItems: response.data.data, isLoading: false, error: null });
    } catch (error) {
      set({ error: "Failed to fetch menu items", isLoading: false });
      console.error("Error fetching menu items:", error);
    }
  },
}));

export default useMenuStore;
