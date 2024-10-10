import type { UserLogin, UserRegister } from "@/typescript/user";
import api from "./config";
import { PaymentType } from "@/typescript/payment";

const yearDayMonthDate = (date = new Date()) => date.toISOString().slice(0, 10).replace(/-/g, "-").split("-").reverse().join("-");

export const authAPI = {
  login: (credentials: UserLogin) => api.post("/auth/login", credentials),
  register: (userData: any) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
};

export const userAPI = {
  getUser: () => api.get("/user"),
};

export const orders = {
  getOrder: (id: string) => api.post(`/orders/customer-list/${id}`),
  createOrder: (data: any) => api.post("/orders/store", data),
  getAvailableTime: () => api.get(`https://bosscrispy.online/time/${yearDayMonthDate}`),
};

export const categoriesAPI = {
  getCategories: () => api.get("/boss/menu-categories"),
  getCategory: (id: string) => api.get(`/boss/menu-categories/${id}`),
};

export const menuAPI = {
  getMenus: () => api.get("/boss/items"),
  getMenu: (id: string) => api.get(`/boss/items/${id}`),
};

export const payment = {
  forTest: (data: PaymentType) => api.post("/payments/create", data),
};
