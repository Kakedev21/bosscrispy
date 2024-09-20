// store/orderStore.ts
import { create } from "zustand";
import { orders } from "@/api/routes";
import useAuthStore from "@/store/authStore";

interface Order {
  id: number;
  user_id: number;
  name: string;
  item_id: number;
  item_name: string;
  item_image: string;
  payment_image: string;
  status: string;
  total_price: string;
}

interface OrderState {
  orders: Order[];
  addOrder: (items: Array<{ itemId: number; payment_image: string; quantity: number }>, totalPrice: number) => Promise<void>;
  getOrdersByUser: () => Promise<Order[]>;
  isLoading: boolean;
}

const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,

  addOrder: async (items, totalPrice) => {
    const { user_id } = useAuthStore.getState();

    if (user_id) {
      try {
        set({ isLoading: true });

        const orderPromises = items.map(async ({ itemId, quantity, payment_image }) => {
          const orderData = {
            user_id,
            item_id: itemId,
            payment_image,
            total_price: totalPrice,
          };

          try {
            const response = await orders.createOrder(orderData);
            return response.data;
          } catch (error) {
            console.error("Error creating order for item:", itemId, error);
            return null;
          }
        });

        const results = await Promise.all(orderPromises);
        const newOrders = results.filter((order) => order !== null);

        set((state) => ({
          orders: [...state.orders, ...newOrders],
        }));
      } catch (error) {
        console.error("Error adding orders:", error);
      } finally {
        set({ isLoading: false });
      }
    }
  },

  getOrdersByUser: async () => {
    const { user_id } = useAuthStore.getState();

    if (user_id) {
      try {
        set({ isLoading: true });

        const response = await orders.getOrder(user_id.toString());
        set({ orders: response.data });
        return response.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
      } finally {
        set({ isLoading: false });
      }
    }
    return [];
  },
}));

export default useOrderStore;
