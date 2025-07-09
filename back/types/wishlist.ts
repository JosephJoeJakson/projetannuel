export interface Wishlist {
  id: number;
  name: string;
  users_permissions_user: number | null;
  products: number[];
  createdAt: string;
  updatedAt: string;
} 