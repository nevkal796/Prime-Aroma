"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DEBOUNCE_MS = 250;
const MAX_RESULTS = 12;

interface SearchResult {
  id: string;
  name: string;
  image_url: string | null;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q.trim())}`,
        { signal: abortRef.current.signal }
      );
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
      setHighlightIndex(-1);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      setHighlightIndex(-1);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setOpen(true);
      fetchResults(query);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchResults]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const el = listRef.current.children[highlightIndex] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  const selectResult = useCallback(
    (result: SearchResult) => {
      setQuery("");
      setOpen(false);
      setResults([]);
      setHighlightIndex(-1);
      router.push(`/products/${result.id}`);
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) {
      if (e.key === "Escape") setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i < results.length - 1 ? i + 1 : i));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : -1));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && results[highlightIndex]) {
        selectResult(results[highlightIndex]);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setHighlightIndex(-1);
      inputRef.current?.blur();
    }
  };

  const displayResults = results.slice(0, MAX_RESULTS);

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <div className="flex items-center gap-2 rounded-md border border-[#0a1628]/20 bg-[#f5f0e8]/80 px-3 py-1.5 min-w-[160px] max-w-[220px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-4 w-4 shrink-0 text-[#0a1628]/50"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search fragrances"
          className="w-full min-w-0 bg-transparent font-sans text-sm text-[#0a1628] placeholder:text-[#0a1628]/50 focus:outline-none"
          aria-label="Search fragrances"
          aria-autocomplete="list"
          aria-controls="search-results-list"
          aria-expanded={open && displayResults.length > 0}
        />
      </div>

      {open && query.trim() && (
        <ul
          id="search-results-list"
          ref={listRef}
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 max-h-[min(320px,60vh)] w-full min-w-[280px] overflow-y-auto rounded-md border border-[#0a1628]/15 bg-[#EDE8D0] py-1 shadow-lg"
        >
          {loading ? (
            <li className="px-4 py-3 font-sans text-sm text-[#0a1628]/60">
              Searching…
            </li>
          ) : displayResults.length === 0 ? (
            <li className="px-4 py-3 font-sans text-sm text-[#0a1628]/60">
              No fragrances found
            </li>
          ) : (
            displayResults.map((item, i) => (
              <li key={item.id} role="option" aria-selected={highlightIndex === i}>
                <Link
                  href={`/products/${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    selectResult(item);
                  }}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 font-sans text-sm text-[#0a1628] hover:bg-[#0a1628]/10 ${
                    highlightIndex === i ? "bg-[#0a1628]/10" : ""
                  }`}
                >
                  {item.image_url ? (
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-[#e8e4de]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 shrink-0 rounded bg-[#0a1628]/10" />
                  )}
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
