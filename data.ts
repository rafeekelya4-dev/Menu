import { Product, Review, Offer, RestaurantInfo } from './types';

export const CATEGORIES = [
  'All',
  'Signature Mains',
  'Starters & Bites',
  'Bakery & Desserts',
  'Premium Drinks'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Dry-Aged Truffle Ribeye Burger',
    description: '28-day dry-aged Black Angus beef, artisanal cave-aged Gruyère cheese, fresh shaved Umbrian black truffles, and house-made truffle aioli on a toasted organic brioche bun. Served with hand-cut rosemary parmigiano frites.',
    price: 24.50,
    originalPrice: 32.00,
    category: 'Signature Mains',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 142,
    prepTime: 20,
    tags: ['Best Seller', 'Chef Special', 'Truffle'],
    calories: 820,
    protein: '48g',
    ingredients: ['28-Day Dry-Aged Angus Beef', 'Fresh Shaved Umbrian Black Truffles', 'Cave-Aged Swiss Gruyère', 'Artisanal Brioche Bun', 'House Truffle Aioli', 'Rosemary Parmigiano-Reggiano', 'Hand-Cut Russet Potatoes'],
    allergens: ['Gluten', 'Dairy', 'Eggs', 'Sesame'],
    spiceLevel: 0,
    available: true,
    isBestseller: true,
    isFeatured: true,
    isPopularThisWeek: true
  },
  {
    id: 'prod-2',
    name: 'Crispy Rice with Spicy Bluefin Tuna',
    description: 'Crispy pan-fried sushi rice blocks topped with spicy bluefin tuna tartare, fresh serrano pepper slivers, micro-cilantro, and a drizzle of sweet tamari glaze.',
    price: 18.00,
    category: 'Starters & Bites',
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 96,
    prepTime: 12,
    tags: ['Gluten-Free', 'Spicy', 'Cold App'],
    calories: 380,
    protein: '24g',
    ingredients: ['Premium Bluefin Tuna Tartare', 'Crispy Sushi Rice Cakes', 'Fresh Serrano Chili Slivers', 'Micro-Cilantro Leaves', 'Spicy Sriracha Sésame Aioli', 'Gluten-Free Tamari Sweet Soy Reduction'],
    allergens: ['Fish', 'Soy', 'Eggs', 'Sesame'],
    spiceLevel: 2,
    available: true,
    isPopularThisWeek: true,
    isChefRecommended: true
  },
  {
    id: 'prod-3',
    name: 'Wild Mushroom Mafaldine Pasta',
    description: 'House-made ribbon mafaldine tossed in a rich velvet reduction of wild chanterelle and porcini mushrooms, finished with fresh thyme, garlic flower, and shaved 36-month Parmigiano-Reggiano.',
    price: 22.00,
    category: 'Signature Mains',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1621996346565-e3bb64e0be5e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 84,
    prepTime: 18,
    tags: ['Vegetarian', 'Handmade'],
    calories: 620,
    protein: '18g',
    ingredients: ['Handmade Mafaldine Egg Ribbon Pasta', 'Chanterelle Mushrooms', 'Porcini Mushrooms', '36-Month Parmigiano-Reggiano', 'Fresh Thyme Leaves', 'Organic Garlic Flower Essence', 'White Truffle Butter Reduction'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    spiceLevel: 0,
    available: true,
    isChefRecommended: true,
    isPopularThisWeek: true
  },
  {
    id: 'prod-4',
    name: 'A5 Wagyu Katsu Sando',
    description: 'Melt-in-your-mouth A5 Miyazaki Wagyu beef cutlet, lightly breaded in Japanese panko and flash-fried, spread with house tonkatsu reduction between toasted custom milk bread.',
    price: 48.00,
    category: 'Signature Mains',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 5.0,
    reviewsCount: 61,
    prepTime: 25,
    tags: ['Premium Reserve', 'Limited'],
    calories: 950,
    protein: '54g',
    ingredients: ['Genuine A5 Miyazaki Wagyu Beef Cutlet', 'Crisp Japanese Panko Crust', 'Toasted Milk Bread (Shokupan)', 'Aromatic House Tonkatsu Red Wine Reduction', 'Organic Pickled Mustard Seed'],
    allergens: ['Gluten', 'Soy', 'Eggs'],
    spiceLevel: 0,
    available: true,
    isFeatured: true,
    isBestseller: true,
    isPopularThisWeek: true
  },
  {
    id: 'prod-5',
    name: 'Sicilian Pistachio Croissant',
    description: 'Twice-baked butter croissant from our master baker, filled with artisanal sweet Sicilian pistachio cream, topped with chopped toasted Bronte pistachios and a dusting of snow sugar.',
    price: 8.50,
    originalPrice: 10.00,
    category: 'Bakery & Desserts',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 215,
    prepTime: 5,
    tags: ['Baker’s Choice', 'Sweet'],
    calories: 450,
    protein: '9g',
    ingredients: ['Twice-Baked French Butter Puff Pastry', 'Artisanal Sweet Sicilian Pistachio Butter', 'Crushed Sicilian Bronte Green Pistachios', 'Powdered Vanilla Snow Sugar'],
    allergens: ['Tree Nuts', 'Gluten', 'Dairy', 'Eggs'],
    spiceLevel: 0,
    available: true,
    isBestseller: true,
    isNewArrival: true
  },
  {
    id: 'prod-6',
    name: 'Smoked Salmon Sourdough Tartine',
    description: 'Locally fermented organic sourdough, crushed Hass avocado, premium cold-smoked Scottish salmon, pickled red onions, nonpareil capers, soft-boiled quail eggs, and fresh dill sprigs.',
    price: 16.50,
    category: 'Starters & Bites',
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.6,
    reviewsCount: 73,
    prepTime: 10,
    tags: ['Healthy', 'High Protein'],
    calories: 510,
    protein: '32g',
    ingredients: ['Locally Fermented Organic Sourdough Slice', 'Premium Cold-Smoked Scottish Salmon', 'Whipped Hass Avocado Mash', 'Soft-Boiled Organic Quail Eggs', 'Pickled Red Onions', 'Nonpareil Greek Capers', 'Fresh Picked Micro Dill Sprigs'],
    allergens: ['Fish', 'Gluten', 'Eggs'],
    spiceLevel: 0,
    available: true,
    isNewArrival: true,
    isChefRecommended: true
  },
  {
    id: 'prod-7',
    name: 'Ceremonial Matcha Oat Latté',
    description: 'Uji stone-ground ceremonial grade matcha, lightly whisked and layered over organic barista-blend oat milk, finished with organic raw wildflower honey.',
    price: 7.50,
    category: 'Premium Drinks',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 110,
    prepTime: 5,
    tags: ['Organic', 'Cold/Hot'],
    calories: 180,
    protein: '4g',
    ingredients: ['Stone-Ground Kyoto Uji Ceremonial Grade Matcha', 'Organic Gluten-Free Barista Oat Milk', 'Raw Manhattan Rooftop Wildflower Honey'],
    allergens: [],
    spiceLevel: 0,
    available: true,
    isPopularThisWeek: true,
    isNewArrival: true
  },
  {
    id: 'prod-8',
    name: 'Deconstructed Yuzu Citrus Tart',
    description: 'Tangy and aromatic Japanese yuzu curd, toasted buttery sable crumbs, pillowy soft torched Swiss meringue kisses, and candied lime peel.',
    price: 11.00,
    originalPrice: 13.50,
    category: 'Bakery & Desserts',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 52,
    prepTime: 8,
    tags: ['Chef Special', 'Aromatic'],
    calories: 340,
    protein: '5g',
    ingredients: ['Aromatic Japanese Kochi Yuzu Curd', 'Toasted Sweet Sablé Cookie Crumbs', 'Pillowy Light Torched Swiss Meringue', 'Candied Organic Lime Zest Slivers'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    spiceLevel: 0,
    available: true,
    isNewArrival: true,
    isChefRecommended: true
  },
  {
    id: 'prod-9',
    name: 'Organic Quinoa Avocado Salad',
    description: 'Organic tri-color quinoa, roasted sweet potatoes, Hass avocado, heirloom cherry tomatoes, organic baby arugula, and crumbled goat cheese, tossed in a wildflower honey-lemon vinaigrette.',
    price: 15.00,
    category: 'Signature Mains',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 45,
    prepTime: 12,
    tags: ['Healthy', 'Vegetarian', 'Gluten-Free'],
    calories: 420,
    protein: '12g',
    ingredients: ['Organic Tri-Color Quinoa', 'Smashed Hass Avocado', 'Heirloom Cherry Tomatoes', 'Organic Baby Arugula', 'Crumbled Goat Cheese', 'Wildflower Honey-Lemon Vinaigrette'],
    allergens: ['Dairy'],
    spiceLevel: 0,
    available: true,
    isChefRecommended: true
  },
  {
    id: 'prod-10',
    name: 'Truffle Parmigiano Fries',
    description: 'Crispy hand-cut Idaho Russet potatoes tossed in premium white truffle oil, freshly grated 24-month Parmigiano-Reggiano, and fresh chopped rosemary, served with truffle garlic aioli.',
    price: 9.50,
    category: 'Starters & Bites',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 180,
    prepTime: 8,
    tags: ['Best Seller', 'Truffle', 'Crispy'],
    calories: 380,
    protein: '6g',
    ingredients: ['Hand-Cut Idaho Russet Potatoes', 'Premium White Truffle Oil', '24-Month Parmigiano-Reggiano', 'Fresh Rosemary', 'Sea Salt Flakes', 'House Garlic Aioli'],
    allergens: ['Dairy', 'Eggs'],
    spiceLevel: 0,
    available: true,
    isBestseller: true,
    isPopularThisWeek: true
  },
  {
    id: 'prod-11',
    name: 'Wagyu Beef Gyoza',
    description: 'Pan-seared Japanese artisanal dumplings filled with finely minced premium seasoned Wagyu beef, scallions, and fresh ginger, served with a toasted sesame soy dipping reduction.',
    price: 14.00,
    category: 'Starters & Bites',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewsCount: 64,
    prepTime: 10,
    tags: ['Pan-Seared', 'Wagyu', 'Savory'],
    calories: 290,
    protein: '16g',
    ingredients: ['Minced Premium Wagyu Beef', 'Fresh Scallions', 'Minced Ginger Root', 'Wonton Wrappers', 'Toasted Sesame Soy Dipping Sauce'],
    allergens: ['Gluten', 'Soy', 'Sesame'],
    spiceLevel: 1,
    available: true,
    isChefRecommended: true
  },
  {
    id: 'prod-12',
    name: 'Valrhona Chocolate Fondant',
    description: 'An exquisite warm French chocolate cake featuring a molten center of premium Valrhona dark chocolate, dusted with cocoa and served with organic Madagascar vanilla bean gelato.',
    price: 12.50,
    category: 'Bakery & Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewsCount: 92,
    prepTime: 12,
    tags: ['Best Seller', 'Warm Dessert', 'Premium'],
    calories: 520,
    protein: '8g',
    ingredients: ['Valrhona Dark Chocolate 70%', 'Organic Butter', 'Pasture-Raised Eggs', 'Unbleached Wheat Flour', 'Madagascar Vanilla Bean Gelato'],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    spiceLevel: 0,
    available: true,
    isBestseller: true
  },
  {
    id: 'prod-13',
    name: 'Hibiscus Rose Iced Tea',
    description: 'Cold-brewed organic Egyptian hibiscus petals steeped and infused with organic pure rose water, fresh garden mint leaves, and a touch of organic light agave nectar, served over ice.',
    price: 6.50,
    category: 'Premium Drinks',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.6,
    reviewsCount: 38,
    prepTime: 4,
    tags: ['Cold Brewed', 'Refreshing', 'Organic'],
    calories: 75,
    protein: '0g',
    ingredients: ['Organic Egyptian Hibiscus Petals', 'Organic Pure Rose Water Essence', 'Fresh Organic Mint Leaves', 'Organic Light Agave Nectar', 'Purified Alkaline Water'],
    allergens: [],
    spiceLevel: 0,
    available: true,
    isNewArrival: true
  },
  {
    id: 'prod-14',
    name: 'Espresso Macchiato',
    description: 'A rich double shot of our house single-origin organic Arabica espresso, stained with a dollop of velvety steamed organic whole milk.',
    price: 4.50,
    category: 'Premium Drinks',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-151097252790b-af4f902673a0?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewsCount: 58,
    prepTime: 3,
    tags: ['Hot', 'Espresso', 'Single-Origin'],
    calories: 30,
    protein: '2g',
    ingredients: ['Single-Origin Arabica Espresso Beans', 'Steamed Organic Whole Milk'],
    allergens: ['Dairy'],
    spiceLevel: 0,
    available: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Clara Sinclair',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    text: 'Absolutely spectacular. The Wagyu Katsu Sando melts instantly in your mouth. You can tell they use authentic Miyazaki beef. Packaged in custom thermal boxes that kept it perfectly hot. Worth every single cent.',
    date: '2026-07-02',
    verified: true,
    helpfulCount: 28
  },
  {
    id: 'rev-2',
    author: 'Marc-André Moreau',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    text: 'My go-to order is the Truffle Ribeye Burger. The dry-aged blend has a spectacular depth of flavor, and the shaved fresh truffle makes a world of difference compared to standard artificial oils. Beautifully presented.',
    date: '2026-06-28',
    verified: true,
    helpfulCount: 19
  },
  {
    id: 'rev-3',
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    rating: 4,
    text: 'The Crispy Rice Spicy Tuna application of ingredients is fantastic. Very crispy rice blocks that do not get soggy during transport. Deducted one star just because the delivery was busy and took 35 mins, but the food quality is unmatched.',
    date: '2026-06-25',
    verified: true,
    helpfulCount: 14
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-1',
    title: 'Chef’s Grand Tasting Offer',
    description: 'Enjoy an exclusive 20% savings on all Signature Mains items today only.',
    code: 'GRANDE20',
    type: 'percentage',
    value: '20%',
    expiresAt: new Date(Date.now() + 3 * 3600 * 1000 + 45 * 60 * 1000).toISOString(), // 3h 45m from now
    badgeText: 'Limited Offer'
  },
  {
    id: 'off-2',
    title: 'Complimentary White Glove Delivery',
    description: 'Get free temperature-controlled delivery for orders over $40.00.',
    code: 'FREESHIP',
    type: 'free_delivery',
    expiresAt: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
    badgeText: 'Free Delivery'
  },
  {
    id: 'off-3',
    title: 'Patisserie Bliss Buy 1 Get 1',
    description: 'Buy one Sicilian Pistachio Croissant, receive a secondary one on us.',
    code: 'PISTACHIO',
    type: 'bogo',
    value: 'BOGO',
    expiresAt: new Date(Date.now() + 1 * 3600 * 1000 + 15 * 60 * 1000).toISOString(),
    badgeText: 'Buy 1 Get 1'
  }
];

export const RESTAURANT_INFO: RestaurantInfo = {
  name: 'L’Étoile Gastronomique',
  logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=150',
  rating: 4.9,
  reviewsCount: 351,
  status: 'open',
  deliveryTime: '20-30 min',
  deliveryFee: 4.99,
  minOrder: 15.00,
  address: '450 Park Avenue, New York, NY 10022',
  hours: [
    { days: 'Mon - Thu', time: '12:00 PM - 10:00 PM' },
    { days: 'Fri - Sat', time: '11:30 AM - 11:30 PM' },
    { days: 'Sunday', time: '12:00 PM - 9:30 PM' }
  ],
  phone: '+1 (212) 555-0199',
  whatsapp: '+1 (212) 555-0199',
  about: "Experience world-class French-American culinary fusion curated by our resident Master Chefs.",
  coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'
};
