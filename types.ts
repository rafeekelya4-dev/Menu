export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[]; // Multiple high-res images for zoom and slider
  rating: number;
  reviewsCount: number;
  prepTime: number; // in minutes
  tags: string[];
  calories?: number;
  protein?: string;
  ingredients?: string[];
  allergens?: string[];
  spiceLevel?: number; // 0 (none) to 3 (very hot)
  available?: boolean; // Stock availability
  isBestseller?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isPopularThisWeek?: boolean;
  isChefRecommended?: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
  userHasHelpful?: boolean;
  replyText?: string; // Chef's response to the review
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  type: 'percentage' | 'free_delivery' | 'bogo' | 'limited';
  value?: string;
  expiresAt: string; // ISO format or future timestamp
  badgeText: string;
  active?: boolean;
}

export interface CartItem {
  id?: string; // Unique cart item identifier
  product: Product;
  quantity: number;
  notes?: string;
  selectedAddons?: { id: string; name: string; price: number; }[];
}

export type RestaurantStatus = 'open' | 'busy' | 'closed';

export interface RestaurantInfo {
  name: string;
  logo: string;
  rating: number;
  reviewsCount: number;
  status: RestaurantStatus;
  deliveryTime: string; // e.g. "15-25 min"
  deliveryFee: number;
  minOrder: number;
  address: string;
  hours: {
    days: string;
    time: string;
  }[];
  phone?: string;
  whatsapp?: string;
  about?: string;
  coverImage?: string;
}

// SaaS Commercial Enterprise Types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'cooking' | 'dispatched';

export interface Order {
  id: string;
  customerName: string;
  phone?: string;
  paymentMethod?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tipAmount: number;
  discount: number;
  total: number;
  status: OrderStatus;
  timestamp: string;
  address: string;
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  value: number;
  minSpend: number;
  active: boolean;
  uses: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'on_break' | 'off_duty';
  phone: string;
}

export interface CustomerCRM {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  joinDate: string;
}

