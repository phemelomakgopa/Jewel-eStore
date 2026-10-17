import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import products, { CATEGORIES } from "../data/products";
import { matchesQuery } from "../utils/catalog";
import { formatPrice } from "../utils/format";
import "./SearchBar.css";

const SearchBar = ({ className = "", placeholder = "Search rings, pearls, gold…" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const listId = useId();
  const ref = useRef(null);

  const urlQuery = location.pathname === "/products" ? new URLSearchParams(location.search).get("q") || "" : "";
  const [query, setQuery] = useState(urlQuery);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  // Keep the box in step with the URL (e.g. after "Clear filters" or Back).
  useEffect(() => setQuery(urlQuery), [urlQuery]);

  const suggestions = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    const categoryHits = CATEGORIES.filter((c) => c.label.toLowerCase().includes(q.toLowerCase())).map((c) => ({
      key: `c-${c.slug}`,
      label: `All ${c.label.toLowerCase()}`,
      to: `/products?category=${c.slug}`,
    }));
    const productHits = products
      .filter((p) => matchesQuery(p, q))
      .slice(0, 5)
      .map((p) => ({ key: `p-${p.id}`, label: p.name, meta: formatPrice(p.price), image: p.image, to: `/product/${p.id}` }));
    return [...categoryHits, ...productHits];
  }, [query]);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (to) => {
    setOpen(false);
    setHighlight(-1);
    navigate(to);
  };

  const submit = (e) => {
    e.preventDefault();
    if (highlight >= 0 && suggestions[highlight]) return go(suggestions[highlight].to);
    const q = query.trim();
    go(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlight(-1);
    }
  };

  const clear = () => {
    setQuery("");
    setHighlight(-1);
    if (urlQuery) {
      const params = new URLSearchParams(location.search);
      params.delete("q");
      navigate(`/products${params.toString() ? `?${params}` : ""}`);
    }
  };

  const showList = open && suggestions.length > 0;

  return (
    <form role="search" className={`search-bar ${className}`} ref={ref} onSubmit={submit}>
      <div className={`search-input-wrapper ${query ? "has-value" : ""}`}>
        <button type="submit" className="search-icon-btn" aria-label="Search">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="search-input"
          aria-label="Search products"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={highlight >= 0 ? `${listId}-${highlight}` : undefined}
        />

        {query && (
          <button className="clear-button" onClick={clear} type="button" aria-label="Clear search">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showList && (
        <ul className="search-suggestions" id={listId} role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={s.key}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === highlight}
              className={`suggestion-item ${i === highlight ? "highlighted" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                go(s.to);
              }}
              onMouseEnter={() => setHighlight(i)}
            >
              {s.image ? <img src={s.image} alt="" className="suggestion-thumb" /> : <span className="suggestion-thumb" />}
              <span className="suggestion-label">{s.label}</span>
              {s.meta && <span className="suggestion-meta">{s.meta}</span>}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;
