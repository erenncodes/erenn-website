// =====================================================
// TEMPLATE DATA - EDIT THIS FILE TO ADD NEW TEMPLATES
// =====================================================
// To add a new template:
// 1. Add a new object to the 'templates' array below
// 2. Upload your thumbnail image to src/assets or use an external URL
// 3. Set the category, price, and other details
// =====================================================

export type Template = {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  demoUrl: string;
  price: {
    code: number;      // Price for source code in PKR
    livesite: number;  // Price for deployed live site in PKR
  };
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
};

export const categories = [
  { id: "all", name: "All Products", count: 0 },
  { id: "special", name: "Special", count: 0 },
  { id: "valentines", name: "Valentines", count: 0 },
  { id: "birthday", name: "Birthday", count: 0 },
  { id: "anniversary", name: "Anniversary", count: 0 },
  { id: "romantic", name: "Romantic", count: 0 },
  { id: "sorry", name: "Sorry", count: 0 },
  { id: "ramadan", name: "Ramadan", count: 0 },
  { id: "friendship", name: "Friendship", count: 0 },
  { id: "business", name: "Business", count: 0 },
];

// =====================================================
// ADD YOUR TEMPLATES HERE
// Each template needs: id, title, description, category, thumbnail, demoUrl, price, tags
// Set isNew: true for new templates
// Set isFeatured: true for featured templates
// =====================================================
export const templates: Template[] = [
  // Add your templates here. Example:
  // {
  //   id: "unique-template-id",
  //   title: "Template Title",
  //   description: "A short description of what this template offers.",
  //   category: "birthday", // Use one of the category IDs above
  //   thumbnail: "https://your-image-url.com/image.jpg",
  //   demoUrl: "https://demo-link.com",
  //   price: { code: 2000, livesite: 1500 }, // Prices in PKR
  //   tags: ["Birthday", "New"],
  //   isNew: true,
  //   isFeatured: true,
  // },
];

// Auto-calculate category counts
categories.forEach(cat => {
  if (cat.id === "all") {
    cat.count = templates.length;
  } else {
    cat.count = templates.filter(t => t.category === cat.id).length;
  }
});
