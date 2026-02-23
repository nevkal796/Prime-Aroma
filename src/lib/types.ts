export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
  size: string | null;
  brand: string | null;
  top_notes: string | null;
  middle_notes: string | null;
  base_notes: string | null;
  key_notes: string | null;
  fragrance_family: string | null;
  scent_type: string | null;
  created_at: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

export interface Order {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  customer_name: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  total: number;
  status: string;
  fulfilled: boolean;
  created_at: string;
  user_id?: string | null;
}

export interface CartItem extends Product {
  quantity: number;
}
