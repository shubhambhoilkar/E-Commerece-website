// Mock products data for Categories page rendering
// Keep ids unique and stable; images use existing assets as safe defaults
const PRODUCTS = [
  { id: 't1', name: 'Rope Tug Toy', price: 299, image: 'https://supertails.com/cdn/shop/files/Frame_1405175479_1800x1800.png?v=1732365307', category: 'Toys' },
  { id: 't2', name: 'Squeaky Bone Toy', price: 249, image: 'https://supertails.com/cdn/shop/files/Frame106721922_1800x1800.png?v=1700289859', category: 'Toys' },
  { id: 'b1', name: 'Cozy Plush Bed (M)', price: 1699, image: 'https://supertails.com/cdn/shop/files/9_82c11737-596f-49c6-8f92-239ec553e811_1800x1800.png?v=1762862853', category: 'Beds' },
  { id: 'b2', name: 'Orthopedic Memory Foam Bed (L)', price: 2999, image: 'https://supertails.com/cdn/shop/files/Frame106721930_600x.png?v=1713783537', category: 'Beds' },
  { id: 'g1', name: 'Gentle Pet Shampoo 250ml', price: 399, image: 'https://supertails.com/cdn/shop/files/200ml_-_2025-06-10T152856.843_1800x1800.jpg?v=1749549594', category: 'Grooming' },
  { id: 'g2', name: 'Nail Clipper & File Kit', price: 349, image: 'https://supertails.com/cdn/shop/files/Frame-2023-07-11T123951.468_1800x1800.png?v=1696635572', category: 'Grooming' },
  { id: 'f1', name: 'Chicken & Rice Kibble 1kg', price: 699, image: 'https://supertails.com/cdn/shop/files/Frame1_5671ca80-8645-42cd-ba91-4486390448e2_1800x1800.jpg?v=1719575289', category: 'Food' },
  { id: 'f2', name: 'Wet Food Pouches (Pack of 6)', price: 549, image: 'https://supertails.com/cdn/shop/products/Frame147-723334_1800x1800.png?v=1696424005', category: 'Food' },
  { id: 'tr1', name: 'Crunchy Training Treats 300g', price: 299, image: 'https://supertails.com/cdn/shop/files/Gnawlers_37_1800x1800.png?v=1727175430', category: 'Treats' },
  { id: 'tr2', name: 'Dental Chews (Pack of 7)', price: 389, image: 'https://supertails.com/cdn/shop/files/FOP_1_1_1800x1800.jpg?v=1734438998', category: 'Treats' },
  { id: 'a1', name: 'Adjustable Collar (M)', price: 249, image: 'https://supertails.com/cdn/shop/files/Frame344684881_600x.png?v=1720426381', category: 'Accessories' },
  { id: 'a2', name: 'Reflective Leash 1.5m', price: 329, image: 'https://supertails.com/cdn/shop/files/StripImages_67_600x.png?v=1752141240', category: 'Accessories' },
  { id: 'h1', name: 'Omega-3 Supplement 60 caps', price: 799, image: 'https://supertails.com/cdn/shop/files/ph_10_abd24675-2500-4764-b9aa-bff75408c83f_600x.jpg?v=1737453823', category: 'Healthcare' },
  { id: 'h2', name: 'Probiotic Powder 100g', price: 649, image: 'https://supertails.com/cdn/shop/files/COMBO0024STPH_1800x1800.jpg?v=1697023795', category: 'Healthcare' },
  { id: 'bf1', name: 'Stainless Steel Bowl (L)', price: 399, image: 'https://supertails.com/cdn/shop/products/image849-106265_600x.png?v=1696446079', category: 'Bowls & Feeders' },
  { id: 'bf2', name: 'No-spill Water Bottle', price: 459, image: 'https://supertails.com/cdn/shop/files/SKATRSTOYS-2024-10-15T155121.137_600x.png?v=1750072430', category: 'Bowls & Feeders' },
  { id: 'lh1', name: 'Clumping Litter 5kg', price: 599, image: 'https://supertails.com/cdn/shop/files/fetcher_26a2db00-972c-422f-ac13-ec282c7c9ce9_1800x1800.png?v=1696582037', category: 'Litter & Hygiene' },
  { id: 'lh2', name: 'Deodorizing Spray 200ml', price: 349, image: 'https://supertails.com/cdn/shop/products/Frame1_13_1_1800x1800.png?v=1696563556', category: 'Litter & Hygiene' },
  { id: 'trn1', name: 'Clicker & Whistle Set', price: 229, image: 'https://supertails.com/cdn/shop/files/IMG_20250708_1308221_1_600x.png?v=1752916517', category: 'Training' },
  { id: 'trn2', name: 'Pee Pads (Pack of 30)', price: 499, image: 'https://supertails.com/cdn/shop/products/Frame10596_f91f9cdf-d3e0-4c9c-8499-2be9e1bdec39-180087_1800x1800.png?v=1696528527', category: 'Training' }
];

const PRODUCT_CATEGORIES = [
  'All',
  'Toys',
  'Beds',
  'Grooming',
  'Food',
  'Treats',
  'Accessories',
  'Healthcare',
  'Bowls & Feeders',
  'Litter & Hygiene',
  'Training'
];

// Expose to global for pages loading via script tags
window.PRODUCTS = PRODUCTS;
window.PRODUCT_CATEGORIES = PRODUCT_CATEGORIES;
