// store/cartStore.ts
import { create } from "zustand";
import { MenuItemType } from "@/typescript/menus";

interface CartItem {
  item: MenuItemType;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addItemToCart: (item: MenuItemType, quantity: number) => void;
  clearCart: () => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
}

const useCartStore = create<CartState>((set) => ({
  cartItems: [],

  addItemToCart: (item, quantity) =>
    set((state) => ({
      cartItems: [...state.cartItems, { item, quantity }],
    })),

  clearCart: () => set({ cartItems: [] }),

  removeFromCart: (itemId) =>
    set((state) => ({
      cartItems: state.cartItems.filter(({ item }) => item.id !== itemId),
    })),

  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map(({ item, quantity: currentQuantity }) => (item.id === itemId ? { item, quantity } : { item, quantity: currentQuantity })),
    })),
}));

export default useCartStore;
