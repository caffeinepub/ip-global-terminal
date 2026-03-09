import { Database, Loader2, Search } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { IPCategory } from "../backend";
import type { IPRecord } from "../backend";
import IPCard from "../components/IPCard";
import IPDetailModal from "../components/IPDetailModal";
import {
  useFilterByCategory,
  useFilterByJurisdiction,
  useGetAllIPs,
  useSearchByTitleOrHash,
} from "../hooks/useQueries";

const JURISDICTIONS = [
  "Global",
  "United States",
  "European Union",
  "United Kingdom",
  "China",
  "Japan",
  "India",
  "Australia",
  "Canada",
  "Brazil",
  "South Korea",
  "Singapore",
  "Switzerland",
  "Germany",
  "France",
  "Netherlands",
];

export default function IPDatabase() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<IPCategory | "">("");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<IPRecord | null>(null);

  // Pass number literals — the hook converts to bigint internally
  const allIPs = useGetAllIPs(0, 200);
  const searchResults = useSearchByTitleOrHash(search);
  const categoryResults = useFilterByCategory(categoryFilter as IPCategory);
  const jurisdictionResults = useFilterByJurisdiction(jurisdictionFilter);

  const records = useMemo(() => {
    if (search.trim()) return searchResults.data ?? [];
    if (categoryFilter) return categoryResults.data ?? [];
    if (jurisdictionFilter) return jurisdictionResults.data ?? [];
    return allIPs.data ?? [];
  }, [
    search,
    categoryFilter,
    jurisdictionFilter,
    allIPs.data,
    searchResults.data,
    categoryResults.data,
    jurisdictionResults.data,
  ]);

  const isLoading =
    allIPs.isLoading ||
    (search.trim() ? searchResults.isLoading : false) ||
    (categoryFilter ? categoryResults.isLoading : false) ||
    (jurisdictionFilter ? jurisdictionResults.isLoading : false);

  const selectStyle: React.CSSProperties = {
    backgroundColor: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "oklch(0.85 0 0)",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem",
    fontSize: "0.8rem",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div
      className="min-h-screen py-10 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "oklch(0.08 0 0)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Database
              className="w-6 h-6"
              style={{ color: "oklch(0.78 0.15 85)" }}
            />
            <h1
              className="text-3xl font-bold"
              style={{
                color: "oklch(0.97 0 0)",
                fontFamily: "Playfair Display, serif",
              }}
            >
              Global IP Database
            </h1>
          </div>
          <p className="text-sm" style={{ color: "oklch(0.55 0 0)" }}>
            Browse all intellectual property records registered on the Internet
            Computer blockchain.
          </p>
        </div>

        {/* Search & Filters — gold border glass panel, matching Register IP form panel */}
        <div
          className="rounded-xl p-5 mb-8"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.40)",
            border: "1.5px solid oklch(0.78 0.15 85 / 0.30)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 0 20px oklch(0.78 0.15 85 / 0.15)",
          }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "rgba(255,255,255,0.45)" }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or SHA-256 hash…"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm"
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "oklch(0.90 0 0)",
                  outline: "none",
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor =
                    "oklch(0.78 0.15 85 / 0.7)";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor =
                    "rgba(255,255,255,0.2)";
                }}
              />
            </div>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as IPCategory | "")
              }
              style={selectStyle}
            >
              <option value="">All Categories</option>
              <option value={IPCategory.patent}>Patent</option>
              <option value={IPCategory.trademark}>Trademark</option>
              <option value={IPCategory.copyright}>Copyright</option>
            </select>

            {/* Jurisdiction filter */}
            <select
              value={jurisdictionFilter}
              onChange={(e) => setJurisdictionFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Jurisdictions</option>
              {JURISDICTIONS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>

            {/* Clear */}
            {(search || categoryFilter || jurisdictionFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("");
                  setJurisdictionFilter("");
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  color: "oklch(0.75 0 0)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "oklch(0.78 0.15 85)" }}
            />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20">
            <Database
              className="w-12 h-12 mx-auto mb-4 opacity-30"
              style={{ color: "oklch(0.78 0.15 85)" }}
            />
            <p
              className="text-lg font-medium"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              {search || categoryFilter || jurisdictionFilter
                ? "No records match your search."
                : "No IP records registered yet."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs mb-4" style={{ color: "oklch(0.45 0 0)" }}>
              {records.length} record{records.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {records.map((record) => (
                <IPCard
                  key={record.id.toString()}
                  record={record}
                  onClick={() => setSelectedRecord(record)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <IPDetailModal
        record={selectedRecord}
        open={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}
