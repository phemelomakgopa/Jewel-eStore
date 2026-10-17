import React, { useEffect, useState } from "react";
import { MATERIALS } from "../utils/catalog";
import "./FilterPanel.css";

// Sidebar on desktop, slide-over sheet on mobile. Filter state belongs to
// the URL (see Shop); this panel only reads and writes it.
const FilterPanel = ({ filters, setParam, clearAll, isOpen, onClose, resultCount }) => {
  const [min, setMin] = useState(filters.min ?? "");
  const [max, setMax] = useState(filters.max ?? "");

  useEffect(() => setMin(filters.min ?? ""), [filters.min]);
  useEffect(() => setMax(filters.max ?? ""), [filters.max]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const applyPrice = (e) => {
    e.preventDefault();
    let lo = min === "" ? null : Math.max(0, Number(min));
    let hi = max === "" ? null : Math.max(0, Number(max));
    if (lo != null && hi != null && lo > hi) [lo, hi] = [hi, lo];
    setParam({ min: lo == null ? "" : String(lo), max: hi == null ? "" : String(hi) });
  };

  return (
    <>
      {isOpen && <div className="filter-overlay" onClick={onClose} aria-hidden="true" />}

      <aside className={`filter-panel ${isOpen ? "open" : ""}`} aria-label="Filters">
        <div className="filter-header">
          <h2>Filters</h2>
          <button type="button" className="filter-close" onClick={onClose} aria-label="Close filters">
            ×
          </button>
        </div>

        <fieldset className="filter-section">
          <legend className="filter-label">Material</legend>
          <div className="chip-group">
            {MATERIALS.map((m) => {
              const active = filters.material === m;
              return (
                <button
                  key={m}
                  type="button"
                  className={`chip ${active ? "active" : ""}`}
                  aria-pressed={active}
                  onClick={() => setParam("material", active ? "" : m)}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </fieldset>

        <form className="filter-section" onSubmit={applyPrice}>
          <fieldset>
            <legend className="filter-label">Price (R)</legend>
            <div className="price-inputs">
              <label>
                <span className="visually-hidden">Minimum price in rand</span>
                <input type="number" inputMode="numeric" min="0" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} />
              </label>
              <span aria-hidden="true">–</span>
              <label>
                <span className="visually-hidden">Maximum price in rand</span>
                <input type="number" inputMode="numeric" min="0" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} />
              </label>
              <button type="submit" className="price-apply">
                Apply
              </button>
            </div>
          </fieldset>
        </form>

        <div className="filter-section">
          <label className="checkbox-option">
            <input type="checkbox" checked={filters.inStock} onChange={(e) => setParam("inStock", e.target.checked)} />
            <span>In stock only</span>
          </label>
        </div>

        <div className="filter-actions">
          <button type="button" className="btn btn-link" onClick={clearAll}>
            Clear all
          </button>
          <button type="button" className="btn btn-primary show-results" onClick={onClose}>
            Show {resultCount} {resultCount === 1 ? "piece" : "pieces"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterPanel;
