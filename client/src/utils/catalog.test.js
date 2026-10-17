import products, { getProductById } from "../data/products";
import { filterProducts, readFilters } from "./catalog";
import { formatPrice, orderAmountToCents } from "./format";

const base = readFilters(new URLSearchParams());

describe("catalogue data", () => {
  it("has unique ids and integer cent prices", () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    products.forEach((p) => expect(Number.isInteger(p.price)).toBe(true));
  });

  it("looks products up by numeric or string id", () => {
    expect(getProductById("6").name).toBe("Diamond Ring");
    expect(getProductById(999)).toBeNull();
  });
});

describe("filterProducts", () => {
  it("filters by category", () => {
    const rings = filterProducts({ ...base, category: "rings" });
    expect(rings.length).toBeGreaterThan(0);
    rings.forEach((p) => expect(p.category).toBe("rings"));
  });

  it("matches plural search terms and every word", () => {
    const pearlEarrings = filterProducts({ ...base, q: "pearl earrings" });
    expect(pearlEarrings.length).toBeGreaterThan(0);
    pearlEarrings.forEach((p) => {
      expect(p.category).toBe("earrings");
      expect(`${p.name} ${p.material}`.toLowerCase()).toContain("pearl");
    });
  });

  it("applies a rand price range to cent prices", () => {
    const results = filterProducts({ ...base, min: 40, max: 60 });
    results.forEach((p) => {
      expect(p.price).toBeGreaterThanOrEqual(4000);
      expect(p.price).toBeLessThanOrEqual(6000);
    });
  });

  it("sorts by price", () => {
    const prices = filterProducts({ ...base, sort: "price-low" }).map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("does not mutate the catalogue order", () => {
    const before = products.map((p) => p.id);
    filterProducts({ ...base, sort: "price-high" });
    expect(products.map((p) => p.id)).toEqual(before);
  });
});

describe("money formatting", () => {
  it("formats cents as rand", () => {
    expect(formatPrice(1999)).toBe("R19.99");
    expect(formatPrice(123456)).toBe("R1,234.56");
  });

  it("reads legacy rand orders and new cent orders", () => {
    expect(orderAmountToCents({ unit: "cents" }, 1999)).toBe(1999);
    expect(orderAmountToCents({}, 19.99)).toBe(1999);
  });
});
