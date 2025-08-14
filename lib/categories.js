export const CATEGORY_TREE = [
  {
    name: 'Women',
    slug: 'women',
    children: [
      {
        name: 'Clothing',
        slug: 'clothing',
        children: [
          { name: 'Kurtis', slug: 'kurtis' },
          { name: 'Dresses', slug: 'dresses' },
          { name: 'Tops', slug: 'tops' },
          { name: 'Gowns', slug: 'gowns' },
          { name: 'Ethnic Wear', slug: 'ethnic' },
        ],
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        children: [
          { name: 'Bags', slug: 'bags' },
          { name: 'Jewellery', slug: 'jewellery' },
          { name: 'Belts', slug: 'belts' },
          { name: 'Scarves', slug: 'scarves' },
        ],
      },
    ],
  },
  {
    name: 'Men',
    slug: 'men',
    children: [
      {
        name: 'Clothing',
        slug: 'clothing',
        children: [
          { name: 'Shirts', slug: 'shirts' },
          { name: 'T-Shirts', slug: 'tshirts' },
          { name: 'Trousers', slug: 'trousers' },
          { name: 'Jeans', slug: 'jeans' },
        ],
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        children: [
          { name: 'Wallets', slug: 'wallets' },
          { name: 'Belts', slug: 'belts' },
          { name: 'Caps', slug: 'caps' },
        ],
      },
    ],
  },
  {
    name: 'Sale',
    slug: 'sale',
    children: [
      {
        name: 'Up to 50% Off',
        slug: 'upto-50',
        children: [
          { name: 'Women', slug: 'women' },
          { name: 'Men', slug: 'men' },
        ],
      },
      {
        name: 'Clearance',
        slug: 'clearance',
        children: [
          { name: 'Last Sizes', slug: 'last-sizes' },
          { name: 'Under ₹999', slug: 'under-999' },
        ],
      },
    ],
  },
];
