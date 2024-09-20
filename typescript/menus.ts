export interface MenuItemType {
  id: number;
  menu_id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
