import type { UserLogin, UserRegister } from "@/typescript/user";
import api from "./config";

export const authAPI = {
  login: (credentials: UserLogin) => api.post("/auth/login", credentials),
  register: (userData: any) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
};

export const userAPI = {
  getUser: () => api.get("/user"),
};

export const orders = {
  getOrder: (id: string) => api.get(`/orders/user/${id}`),
  createOrder: (data: any) => api.post("/boss/orders", data),
};

export const categoriesAPI = {
  getCategories: () => api.get("/boss/menu-categories"),
  getCategory: (id: string) => api.get(`/boss/menu-categories/${id}`),
};

export const menuAPI = {
  getMenus: () => api.get("/boss/menu-items"),
  getMenu: (id: string) => api.get(`/boss/menu-items/${id}`),
};
