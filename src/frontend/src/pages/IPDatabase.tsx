import {
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Database,
  Globe,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Shield,
  Trash2,
} from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { IPCategory } from "../backend";
import type { IPDatabaseRecord } from "../backend";
import type { IPRecord } from "../backend";
import AddIPRecordModal from "../components/AddIPRecordModal";
import DeleteIPRecordConfirmation from "../components/DeleteIPRecordConfirmation";
import EditIPRecordModal, {
  type EditableRecord,
} from "../components/EditIPRecordModal";
import IPCard from "../components/IPCard";
import IPDetailModal from "../components/IPDetailModal";
import { type MockIPRecord, mockIPDatabase } from "../data/mockIPDatabase";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteIPRecord,
  useFilterByCategory,
  useFilterByJurisdiction,
  useGetAllIPRecords,
  useGetAllIPs,
  useSearchByTitleOrHash,
} from "../hooks/useQueries";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DisplayRecord {
  ipAddress: string;
  owner: string;
  country: string;
  city: string;
  registrationDate: number; // ms
  status: "active" | "flagged" | "blocked";
  isBackend: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDisplayRecord(
  r: IPDatabaseRecord,
  isBackend: boolean,
): DisplayRecord {
  return {
    ipAddress: r.ipAddress,
    owner: r.owner,
    country: r.country,
    city: r.city,
    registrationDate: Number(r.registrationDate),
    status: (r.status as "active" | "flagged" | "blocked") ?? "active",
    isBackend,
  };
}

function mockToDisplay(r: MockIPRecord): DisplayRecord {
  return {
    ipAddress: r.ipAddress,
    owner: r.owner,
    country: r.country,
    city: r.city,
    registrationDate: r.registrationDate,
    status: r.status,
    isBackend: false,
  };
}

function StatusBadge({ status }: { status: "active" | "flagged" | "blocked" }) {
  const styles: Record<string, React.CSSProperties> = {
    active: {
      backgroundColor: "oklch(0.35 0.12 145 / 0.25)",
      color: "oklch(0.75 0.15 145)",
      border: "1px solid oklch(0.55 0.15 145 / 0.40)",
    },
    flagged: {
      backgroundColor: "oklch(0.40 0.15 75 / 0.25)",
      color: "oklch(0.80 0.15 75)",
      border: "1px solid oklch(0.60 0.15 75 / 0.40)",
    },
    blocked: {
      backgroundColor: "oklch(0.35 0.18 25 / 0.25)",
      color: "oklch(0.72 0.18 25)",
      border: "1px solid oklch(0.55 0.18 25 / 0.40)",
    },
  };

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide"
      style={styles[status] ?? styles.active}
    >
      {status}
    </span>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

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

// ── Main Component ────────────────────────────────────────────────────────────

type TabView = "ip-database" | "ip-registry";

export default function IPDatabase() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // ── Tab state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabView>("ip-database");

  // ── IP Registry (existing) state ───────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<IPCategory | "">("");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<IPRecord | null>(null);

  const allIPs = useGetAllIPs(0, 200);
  const searchResults = useSearchByTitleOrHash(search);
  const categoryResults = useFilterByCategory(categoryFilter as IPCategory);
  const jurisdictionResults = useFilterByJurisdiction(jurisdictionFilter);

  const ipRegistryRecords = useMemo(() => {
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

  const isRegistryLoading =
    allIPs.isLoading ||
    (search.trim() ? searchResults.isLoading : false) ||
    (categoryFilter ? categoryResults.isLoading : false) ||
    (jurisdictionFilter ? jurisdictionResults.isLoading : false);

  // ── IP Database state ──────────────────────────────────────────────────────
  const [dbSearch, setDbSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [orgFilter, setOrgFilter] = useState("");

  // Local mock records (can be edited/deleted)
  const [localMockRecords, setLocalMockRecords] = useState<DisplayRecord[]>(
    () => mockIPDatabase.map(mockToDisplay),
  );

  // Backend records
  const { data: backendRecords, isLoading: backendLoading } =
    useGetAllIPRecords();

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<EditableRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DisplayRecord | null>(null);

  const deleteMutation = useDeleteIPRecord();

  // Merge backend + mock records (backend takes precedence for same IP)
  const allDisplayRecords = useMemo(() => {
    const backendDisplayed = (backendRecords ?? []).map((r) =>
      toDisplayRecord(r, true),
    );
    const backendIPs = new Set(backendDisplayed.map((r) => r.ipAddress));
    const filteredMock = localMockRecords.filter(
      (r) => !backendIPs.has(r.ipAddress),
    );
    return [...backendDisplayed, ...filteredMock];
  }, [backendRecords, localMockRecords]);

  // Unique countries for filter dropdown
  const uniqueCountries = useMemo(() => {
    const countries = Array.from(
      new Set(allDisplayRecords.map((r) => r.country)),
    ).sort();
    return countries;
  }, [allDisplayRecords]);

  // Unique orgs for filter dropdown
  const uniqueOrgs = useMemo(() => {
    const orgs = Array.from(
      new Set(allDisplayRecords.map((r) => r.owner)),
    ).sort();
    return orgs;
  }, [allDisplayRecords]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return allDisplayRecords.filter((r) => {
      const matchSearch =
        !dbSearch.trim() ||
        r.ipAddress.toLowerCase().includes(dbSearch.toLowerCase()) ||
        r.owner.toLowerCase().includes(dbSearch.toLowerCase());
      const matchStatus = !statusFilter || r.status === statusFilter;
      const matchCountry = !countryFilter || r.country === countryFilter;
      const matchOrg = !orgFilter || r.owner === orgFilter;
      return matchSearch && matchStatus && matchCountry && matchOrg;
    });
  }, [allDisplayRecords, dbSearch, statusFilter, countryFilter, orgFilter]);

  const hasDbFilters = dbSearch || statusFilter || countryFilter || orgFilter;

  const clearDbFilters = () => {
    setDbSearch("");
    setStatusFilter("");
    setCountryFilter("");
    setOrgFilter("");
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleEditRecord = useCallback((record: DisplayRecord) => {
    setEditRecord({
      ipAddress: record.ipAddress,
      owner: record.owner,
      country: record.country,
      city: record.city,
      registrationDate: record.registrationDate,
      status: record.status,
      isBackend: record.isBackend,
    });
  }, []);

  const handleEditSuccess = useCallback((updated: EditableRecord) => {
    if (!updated.isBackend) {
      setLocalMockRecords((prev) =>
        prev.map((r) =>
          r.ipAddress === updated.ipAddress
            ? {
                ...r,
                owner: updated.owner,
                country: updated.country,
                city: updated.city,
                registrationDate: updated.registrationDate,
                status: updated.status,
              }
            : r,
        ),
      );
    }
    // Backend records are refreshed via React Query invalidation in the hook
  }, []);

  const handleDeleteRecord = useCallback((record: DisplayRecord) => {
    setDeleteTarget(record);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    if (deleteTarget.isBackend) {
      try {
        await deleteMutation.mutateAsync(deleteTarget.ipAddress);
        setDeleteTarget(null);
      } catch {
        // error handled by mutation state
      }
    } else {
      setLocalMockRecords((prev) =>
        prev.filter((r) => r.ipAddress !== deleteTarget.ipAddress),
      );
      setDeleteTarget(null);
    }
  }, [deleteTarget, deleteMutation]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen py-10 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "oklch(0.08 0 0)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
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
            Browse IP address records and blockchain-registered intellectual
            property.
          </p>
        </div>

        {/* Tab Navigation */}
        <div
          className="flex gap-1 mb-8 p-1 rounded-xl w-fit"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {[
            { id: "ip-database" as TabView, label: "IP Address Database" },
            { id: "ip-registry" as TabView, label: "IP Registry (Blockchain)" },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={
                activeTab === tab.id
                  ? {
                      backgroundColor: "oklch(0.78 0.15 85)",
                      color: "oklch(0.08 0 0)",
                      boxShadow: "0 0 12px oklch(0.78 0.15 85 / 0.30)",
                    }
                  : {
                      backgroundColor: "transparent",
                      color: "oklch(0.65 0 0)",
                    }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── IP Address Database Tab ── */}
        {activeTab === "ip-database" && (
          <>
            {/* Toolbar */}
            <div
              className="rounded-xl p-5 mb-6"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.40)",
                border: "1.5px solid oklch(0.78 0.15 85 / 0.30)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 0 20px oklch(0.78 0.15 85 / 0.15)",
              }}
            >
              <div className="flex flex-col gap-3">
                {/* Row 1: Search + Add button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    />
                    <input
                      type="text"
                      value={dbSearch}
                      onChange={(e) => setDbSearch(e.target.value)}
                      placeholder="Search by IP address or owner…"
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

                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={() => setAddModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                      style={{
                        backgroundColor: "oklch(0.78 0.15 85)",
                        color: "oklch(0.08 0 0)",
                        boxShadow: "0 0 14px oklch(0.78 0.15 85 / 0.25)",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "oklch(0.85 0.14 85)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "oklch(0.78 0.15 85)";
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Add IP Record
                    </button>
                  )}
                </div>

                {/* Row 2: Filters */}
                <div className="flex flex-wrap gap-2 items-center">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="flagged">Flagged</option>
                    <option value="blocked">Blocked</option>
                  </select>

                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">All Countries</option>
                    {uniqueCountries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={orgFilter}
                    onChange={(e) => setOrgFilter(e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">All Organisations</option>
                    {uniqueOrgs.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>

                  {hasDbFilters && (
                    <button
                      type="button"
                      onClick={clearDbFilters}
                      className="px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        color: "oklch(0.75 0 0)",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results count */}
            {!backendLoading && (
              <p className="text-xs mb-4" style={{ color: "oklch(0.45 0 0)" }}>
                {filteredRecords.length} record
                {filteredRecords.length !== 1 ? "s" : ""} found
                {hasDbFilters ? " (filtered)" : ""}
              </p>
            )}

            {/* Loading */}
            {backendLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: "oklch(0.78 0.15 85)" }}
                />
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-20">
                <Database
                  className="w-12 h-12 mx-auto mb-4 opacity-30"
                  style={{ color: "oklch(0.78 0.15 85)" }}
                />
                <p
                  className="text-lg font-medium"
                  style={{ color: "oklch(0.55 0 0)" }}
                >
                  {hasDbFilters
                    ? "No records match your filters."
                    : "No IP records found."}
                </p>
              </div>
            ) : (
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  backgroundColor: "rgba(0,0,0,0.30)",
                }}
              >
                {/* Table header */}
                <div
                  className="hidden md:grid grid-cols-[2fr_2fr_1.5fr_1fr_1.2fr_auto] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: "oklch(0.78 0.15 85)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    backgroundColor: "rgba(0,0,0,0.20)",
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    IP Address
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Owner / Org
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Location
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Registered
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Status
                  </span>
                  <span>Actions</span>
                </div>

                {/* Table rows */}
                <div
                  className="divide-y"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  {filteredRecords.map((record) => (
                    <IPDatabaseRow
                      key={record.ipAddress}
                      record={record}
                      isAuthenticated={isAuthenticated}
                      onEdit={handleEditRecord}
                      onDelete={handleDeleteRecord}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── IP Registry (Blockchain) Tab ── */}
        {activeTab === "ip-registry" && (
          <>
            {/* Search & Filters */}
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

            {isRegistryLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: "oklch(0.78 0.15 85)" }}
                />
              </div>
            ) : ipRegistryRecords.length === 0 ? (
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
                <p
                  className="text-xs mb-4"
                  style={{ color: "oklch(0.45 0 0)" }}
                >
                  {ipRegistryRecords.length} record
                  {ipRegistryRecords.length !== 1 ? "s" : ""} found
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ipRegistryRecords.map((record) => (
                    <IPCard
                      key={record.id.toString()}
                      record={record}
                      onClick={() => setSelectedRecord(record)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <IPDetailModal
        record={selectedRecord}
        open={selectedRecord !== null}
        onClose={() => setSelectedRecord(null)}
      />

      <AddIPRecordModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {}}
      />

      <EditIPRecordModal
        open={editRecord !== null}
        record={editRecord}
        onClose={() => setEditRecord(null)}
        onSuccess={handleEditSuccess}
      />

      <DeleteIPRecordConfirmation
        open={deleteTarget !== null}
        ipAddress={deleteTarget?.ipAddress ?? ""}
        owner={deleteTarget?.owner ?? ""}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// ── IP Database Row ───────────────────────────────────────────────────────────

interface IPDatabaseRowProps {
  record: DisplayRecord;
  isAuthenticated: boolean;
  onEdit: (record: DisplayRecord) => void;
  onDelete: (record: DisplayRecord) => void;
}

function IPDatabaseRow({
  record,
  isAuthenticated,
  onEdit,
  onDelete,
}: IPDatabaseRowProps) {
  const dateStr = new Date(record.registrationDate).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <div
      className="group px-5 py-4 transition-colors"
      style={{ backgroundColor: "transparent" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor =
          "rgba(255,255,255,0.03)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor =
          "transparent";
      }}
    >
      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-[2fr_2fr_1.5fr_1fr_1.2fr_auto] gap-4 items-center">
        <span
          className="font-mono text-sm"
          style={{ color: "oklch(0.78 0.15 85)" }}
        >
          {record.ipAddress}
          {record.isBackend && (
            <span
              className="ml-2 text-xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: "oklch(0.78 0.15 85 / 0.12)",
                color: "oklch(0.78 0.15 85 / 0.70)",
                fontSize: "0.65rem",
              }}
            >
              on-chain
            </span>
          )}
        </span>
        <span className="text-sm truncate" style={{ color: "oklch(0.80 0 0)" }}>
          {record.owner}
        </span>
        <span className="text-sm" style={{ color: "oklch(0.65 0 0)" }}>
          {record.city}, {record.country}
        </span>
        <span className="text-xs" style={{ color: "oklch(0.50 0 0)" }}>
          {dateStr}
        </span>
        <StatusBadge status={record.status} />
        {isAuthenticated ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(record)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "oklch(0.55 0 0)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "oklch(0.78 0.15 85)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "oklch(0.55 0 0)";
              }}
              title="Edit record"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(record)}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "oklch(0.55 0 0)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "oklch(0.70 0.20 25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "oklch(0.55 0 0)";
              }}
              title="Delete record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-16" />
        )}
      </div>

      {/* Mobile layout */}
      <div className="md:hidden space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span
            className="font-mono text-sm font-semibold"
            style={{ color: "oklch(0.78 0.15 85)" }}
          >
            {record.ipAddress}
          </span>
          <StatusBadge status={record.status} />
        </div>
        <div className="text-sm" style={{ color: "oklch(0.75 0 0)" }}>
          {record.owner}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "oklch(0.55 0 0)" }}>
            {record.city}, {record.country} · {dateStr}
          </span>
          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(record)}
                className="p-1.5 rounded-lg"
                style={{ color: "oklch(0.55 0 0)" }}
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(record)}
                className="p-1.5 rounded-lg"
                style={{ color: "oklch(0.55 0 0)" }}
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
