import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CATEGORIES, getCategoryLabel } from "../data/products";
import { filterProducts, readFilters, SORT_OPTIONS } from "../utils/catalog";
import ProductCard from "./ProductCard";
import FilterPanel from "./FilterPanel";
import "./Shop.css";

// The full catalogue. Every filter lives in the URL, so results can be
// shared, bookmarked and stepped through with Back/Forward.
const Shop = () => {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = readFilters(params);
  const results = useMemo(() => filterProducts(filters), [params]); // eslint-disable-line react-hooks/exhaustive-deps

  // setParam("sort", "newest") or setParam({ min: "100", max: "" })
  const setParam = (keyOrUpdates, value) => {
    const updates = typeof keyOrUpdates === "string" ? { [keyOrUpdates]: value } : keyOrUpdates;
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === "" || val == null || val === false) next.delete(key);
      else next.set(key, val === true ? "1" : val);
    });
    // Category changes get their own history entry; fine-tuning doesn't.
    setParams(next, { replace: !("category" in updates) });
  };

  const clearAll = () => setParams({});

  const heading = filters.q
    ? `Results for “${filters.q}”`
    : filters.category
    ? getCategoryLabel(filters.category)
    : "All jewellery";

  const activeCount = ["material", "min", "max", "inStock"].filter((k) => params.get(k)).length;

  return (
    <div className="shop">
      <header className="shop-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          {filters.category || filters.q ? <Link to="/products">Shop</Link> : <span>Shop</span>}
          {filters.category && (
            <>
              <span aria-hidden="true">/</span>
              <span>{getCategoryLabel(filters.category)}</span>
            </>
          )}
        </nav>
        <h1 className="shop-title">{heading}</h1>

        <div className="category-tabs" aria-label="Categories">
          <button
            type="button"
            className={`category-tab ${!filters.category ? "active" : ""}`}
            onClick={() => setParam("category", "")}
            aria-pressed={!filters.category}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
                className={`category-tab ${filters.category === c.slug ? "active" : ""}`}
              onClick={() => setParam("category", c.slug)}
              aria-pressed={filters.category === c.slug}
            >
              {c.label}
            </button>
          ))}
        </div>
      </header>

      <div className="shop-toolbar">
        <p className="result-count" aria-live="polite">
          {results.length} {results.length === 1 ? "piece" : "pieces"}
        </p>
        <div className="toolbar-actions">
          <button type="button" className="filter-toggle" onClick={() => setFiltersOpen(true)}>
            Filters{activeCount > 0 && ` (${activeCount})`}
          </button>
          <label className="sort-control">
            <span>Sort</span>
            <select value={filters.sort} onChange={(e) => setParam("sort", e.target.value === "featured" ? "" : e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="shop-body">
        <FilterPanel
          filters={filters}
          setParam={setParam}
          clearAll={clearAll}
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          resultCount={results.length}
        />

        <div className="shop-results">
          {results.length === 0 ? (
            <div className="empty-state">
              <h2>Nothing matches yet</h2>
              <p>
                {filters.q
                  ? `We couldn't find anything for “${filters.q}”. Try a broader word like “gold” or “pearl”.`
                  : "No pieces match these filters. Remove a filter or start again."}
              </p>
              <button type="button" className="btn btn-primary" onClick={clearAll}>
                Clear search and filters
              </button>
            </div>
          ) : (
            <div className="shop-grid">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} showMeta />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
