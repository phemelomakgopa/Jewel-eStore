import products from "../data/products";

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest first" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "name", label: "Name (A–Z)" },
];

export const MATERIALS = ["Gold", "Silver", "Platinum", "Bronze", "Diamond", "Pearl", "Shell", "Bead"];

// Read the shop filters from the URL so results are shareable and survive
// back/forward navigation.
export const readFilters = (params) => ({
  q: params.get("q") || "",
  category: params.get("category") || "",
  material: params.get("material") || "",
  min: params.get("min") ? Number(params.get("min")) : null,
  max: params.get("max") ? Number(params.get("max")) : null,
  inStock: params.get("inStock") === "1",
  sort: params.get("sort") || "featured",
});

export const matchesQuery = (product, q) => {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const haystack = `${product.name} ${product.material} ${product.category} ${product.description}`.toLowerCase();
  return terms.every((t) => haystack.includes(t.replace(/s$/, "")));
};

export const filterProducts = (filters, list = products) => {
  const { q, category, material, min, max, inStock, sort } = filters;
  const results = list.filter(
    (p) =>
      matchesQuery(p, q) &&
      (!category || p.category === category) &&
      (!material || p.material.toLowerCase().includes(material.toLowerCase())) &&
      (min == null || p.price >= min * 100) &&
      (max == null || p.price <= max * 100) &&
      (!inStock || p.stock > 0)
  );

  switch (sort) {
    case "newest":
      return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case "price-low":
      return results.sort((a, b) => a.price - b.price);
    case "price-high":
      return results.sort((a, b) => b.price - a.price);
    case "name":
      return results.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return results;
  }
};
