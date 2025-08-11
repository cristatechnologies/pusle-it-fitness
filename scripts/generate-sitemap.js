const fs = require("fs");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const FRONT_URL = "https://pulseitfitness.com";
const BLOG_API = `${BASE_URL}api/blog`;
const staticRoutes = [
  "",
  "/shop",
  "/cart",
  // "/checkout",
  "/contact-us",
  // "/profile/dashboard",
  // "/profile/change-password",
  // "/profile/my-address",
  // "/profile/orders",
  // "/profile/personal-info",
  // "/wishlist",
  "/sign-in",
  "/sign-up",
];


async function fetchAllBlogs() {
  let allBlogs = [];
  let currentPage = 1;
  let totalPages = 1;

  try {
    // First request to get pagination info
    const firstPageRes = await axios.get(`${BLOG_API}?page=${currentPage}`);
    const firstPageData = firstPageRes.data.blogs;
    allBlogs = [...firstPageData.data];
    totalPages = firstPageData.last_page;

    // Remaining pages
    while (currentPage < totalPages) {
      currentPage++;
      const res = await axios.get(`${BLOG_API}?page=${currentPage}`);
      allBlogs = [...allBlogs, ...res.data.blogs.data];
    }

    // Return blog routes
    return allBlogs.map((blog) => `/blogs/${blog.slug}`);
  } catch (err) {
    console.error("❌ Error fetching blogs:", err);
    return [];
  }
}

// Fetch dynamic CMS pages
async function fetchCustomPages() {
  try {
    const res = await axios.get(`${BASE_URL}api/website-setup`);
    const pages = res.data?.customPages || [];
    return pages.map((page) => `/${page.slug}`);
  } catch (err) {
    console.error("❌ Error fetching custom pages:", err);
    return [];
  }
}

// Recursively collect category slugs
function getCategorySlugs(categories, parent = "") {
  const slugs = [];

  for (const category of categories) {
    const categoryPath = `/shop/${category.slug}`;
    slugs.push(categoryPath);

    if (Array.isArray(category.children) && category.children.length > 0) {
      slugs.push(...getCategorySlugs(category.children));
    }
  }

  return slugs;
}

// Fetch all products with pagination
async function fetchAllProducts() {
  let allProducts = [];
  let currentPage = 1;
  let totalPages = 1;

  try {
    // Fetch first page to get pagination info
    const firstPageRes = await axios.get(
      `${BASE_URL}api/product?page=${currentPage}`
    );
    const firstPageData = firstPageRes.data;

    allProducts = [...firstPageData.products.data];
    totalPages = firstPageData.products.last_page;

    // Fetch remaining pages if they exist
    while (currentPage < totalPages) {
      currentPage++;
      const res = await axios.get(`${BASE_URL}api/product?page=${currentPage}`);
      allProducts = [...allProducts, ...res.data.products.data];
    }

    return allProducts;
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    return [];
  }
}

// Fetch products and categories
async function fetchProductAndCategoryRoutes() {
  try {
    const res = await axios.get(`${BASE_URL}api/product`);
    const categories = res.data?.categories || [];
    const products = await fetchAllProducts();

    const categoryRoutes = getCategorySlugs(categories);

    const categoryIdToSlugMap = {};
    const flattenCategories = (cats) => {
      for (const cat of cats) {
        categoryIdToSlugMap[cat.id] = cat.slug;
        if (Array.isArray(cat.children)) flattenCategories(cat.children);
      }
    };
    flattenCategories(categories);

    const productRoutes = products.map((product) => {
      const categorySlug =
        categoryIdToSlugMap[product.category_id] || "unknown";
      return `/shop/${categorySlug}/${product.slug}`;
    });

    return [...categoryRoutes, ...productRoutes];
  } catch (err) {
    console.error("❌ Error fetching product/category routes:", err);
    return [];
  }
}

// XML generator
function generateXML(urls) {
  const xmlItems = urls
    .map(
      (url) => `
  <url>
    <loc>${FRONT_URL}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${xmlItems}
</urlset>`;
}

// Main generator
async function buildSitemap() {
  const customPages = await fetchCustomPages();
  const productAndCategoryRoutes = await fetchProductAndCategoryRoutes();
  const blogRoutes = await fetchAllBlogs();

  const allRoutes = [
    ...staticRoutes,
    ...customPages,
    ...productAndCategoryRoutes,
    ...blogRoutes,
  ];

  const sitemap = generateXML(allRoutes);
  const filePath = path.join(process.cwd(), "public", "sitemap.xml");

  fs.writeFileSync(filePath, sitemap, "utf8");
  console.log("✅ Sitemap generated at /public/sitemap.xml");
}

buildSitemap();
