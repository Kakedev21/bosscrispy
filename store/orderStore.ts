// store/orderStore.ts
import { create } from "zustand";
import { orders } from "@/api/routes";
import useAuthStore from "@/store/authStore";

interface Order {
  id: number;
  user_id: number;
  quantity: number;
  item: {
    name: string;
    thumbnail: string;
    preparation_time: string;
    price: number;
    quantity: number;
  };
  status: string;
  total_price: string;
  created_at: string;
}

interface OrderState {
  orders: Order[];
  addOrder: any;
  getOrdersByUser: () => Promise<Order[]>;
  isLoading: boolean;
}

const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,

  addOrder: async (items, totalPrice) => {
    const { user_id, email, name, phone_number } = useAuthStore.getState();

    if (user_id) {
      try {
        set({ isLoading: true });
        const orderPromises = items.map(async (item) => {
          const orderData = {
            customer_id: String(user_id),
            item_id: String(item.item.id),
            quantity: String(item.quantity),
            delivery_time: String(item.time),
            delivery_date: `${new Date().getFullYear()}-${String(new Date().getDate()).padStart(2, "0")}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
            price: String(Number(item.item.price) * item.quantity),
            payment_status: "PAID",
            status: "PENDING",
          };

          try {
            const response = await orders.createOrder(orderData);
            return response.data;
          } catch (error) {
            console.error("Error creating order for item:", error);
            return null;
          }
        });

        const results = await Promise.all(orderPromises);
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
        set({ orders: response.data.data });
        return response.data.data;
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
