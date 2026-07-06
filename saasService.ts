import { Coupon, Employee, CustomerCRM, Order, Product } from '../types';

/**
 * Initial Coupons/Discounts
 */
export const INITIAL_COUPONS: Coupon[] = [
  { id: 'c1', code: 'GRANDE20', type: 'percentage', value: 20, minSpend: 30, active: true, uses: 42 },
  { id: 'c2', code: 'FREESHIP', type: 'free_delivery', value: 0, minSpend: 40, active: true, uses: 128 },
  { id: 'c3', code: 'PISTACHIO', type: 'percentage', value: 100, minSpend: 15, active: true, uses: 19 },
  { id: 'c4', code: 'WELCOME5', type: 'fixed', value: 5, minSpend: 20, active: true, uses: 86 }
];

/**
 * Initial Staff Directory
 */
export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Pierre Marceau', role: 'Head Chef de Cuisine', status: 'active', phone: '+1 (555) 928-1029' },
  { id: 'emp-2', name: 'Sophia Vance', role: 'Maitre D / Front Lead', status: 'active', phone: '+1 (555) 349-8812' },
  { id: 'emp-3', name: 'Jacques Clouseau', role: 'First Courier Dispatcher', status: 'active', phone: '+1 (555) 219-9028' },
  { id: 'emp-4', name: 'Jean-Luc Picard', role: 'Sommelier Lead', status: 'on_break', phone: '+1 (555) 481-9921' }
];

/**
 * Customer CRM database
 */
export const INITIAL_CUSTOMERS: CustomerCRM[] = [
  { id: 'crm-1', name: 'Clara Sinclair', email: 'clara.s@sinclair-holdings.co', ordersCount: 24, totalSpent: 912.40, joinDate: '2025-09-12' },
  { id: 'crm-2', name: 'Marc-André Moreau', email: 'm.moreau@paris-cuisine.org', ordersCount: 18, totalSpent: 624.50, joinDate: '2025-11-20' },
  { id: 'crm-3', name: 'Elena Rostova', email: 'elena.r@rostov-design.com', ordersCount: 12, totalSpent: 382.00, joinDate: '2026-01-15' },
  { id: 'crm-4', name: 'Lady Vivienne', email: 'vivienne@chelsea-manor.uk', ordersCount: 9, totalSpent: 485.50, joinDate: '2026-03-02' },
  { id: 'crm-5', name: 'Lord Winston', email: 'winston@belgravia.co.uk', ordersCount: 31, totalSpent: 1840.00, joinDate: '2025-05-18' }
];

/**
 * Generates an initial list of active orders to populate the backoffice on boot
 */
export const getInitialOrders = (products: Product[]): Order[] => {
  return [
    {
      id: 'order-1082',
      customerName: 'Clara Sinclair',
      phone: '+1 (555) 892-0034',
      paymentMethod: 'Apple Pay',
      items: [
        { product: products[0] || products[0], quantity: 1, notes: 'Medium rare on the beef. Shave truffles generously!' },
        { product: products[4] || products[0], quantity: 2 }
      ],
      subtotal: 41.50,
      deliveryFee: 4.99,
      tipAmount: 8.50,
      discount: 8.30, // 20% on subtotal via GRANDE20
      total: 46.69,
      status: 'preparing',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
      address: '740 Park Avenue, Apt 14B, New York, NY 10021'
    },
    {
      id: 'order-1081',
      customerName: 'Marc-André Moreau',
      phone: '+1 (555) 349-1192',
      paymentMethod: 'Visa Ending *4029',
      items: [
        { product: products[1] || products[0], quantity: 2 },
        { product: products[6] || products[0], quantity: 1 }
      ],
      subtotal: 43.50,
      deliveryFee: 0, // Free Delivery offer
      tipAmount: 10.00,
      discount: 0,
      total: 53.50,
      status: 'pending',
      timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 mins ago
      address: '229 East 60th Street, New York, NY 10022'
    },
    {
      id: 'order-1079',
      customerName: 'Elena Rostova',
      phone: '+1 (555) 712-4581',
      paymentMethod: 'Mastercard Ending *9201',
      items: [
        { product: products[2] || products[0], quantity: 1, notes: 'Extra parmigiano please.' }
      ],
      subtotal: 22.00,
      deliveryFee: 4.99,
      tipAmount: 5.00,
      discount: 0,
      total: 31.99,
      status: 'out_for_delivery',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
      address: 'Trump Tower, Suite 41A, New York, NY 10022'
    }
  ];
};
