import { useState, useMemo } from 'react';
import { useGetAllIPs, useSearchByTitle, useFilterByCategory, useFilterByJurisdiction } from '../hooks/useQueries';
import { IPCategory, type IPRecord } from '../backend';
import IPCard from '../components/IPCard';
import IPDetailModal from '../components/IPDetailModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Database, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const PAGE_SIZE = 12;

export default function IPDatabase() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<IPCategory | 'all'>('all');
  const [jurisdictionFilter, setJurisdictionFilter] = useState('');
  const [activeJurisdiction, setActiveJurisdiction] = useState('');
  const [selectedId, setSelectedId] = useState<bigint | null>(null);

  const isFiltered = activeSearch || categoryFilter !== 'all' || activeJurisdiction;

  // Paginated all IPs
  const { data: allIPs, isLoading: allLoading } = useGetAllIPs(page * PAGE_SIZE, PAGE_SIZE);

  // Search by title
  const { data: searchResults, isLoading: searchLoading } = useSearchByTitle(activeSearch);

  // Filter by category
  const { data: categoryResults, isLoading: categoryLoading } = useFilterByCategory(
    categoryFilter !== 'all' ? categoryFilter : null
  );

  // Filter by jurisdiction
  const { data: jurisdictionResults, isLoading: jurisdictionLoading } = useFilterByJurisdiction(activeJurisdiction);

  const isLoading = allLoading || searchLoading || categoryLoading || jurisdictionLoading;

  const displayedRecords = useMemo((): IPRecord[] => {
    if (!isFiltered) return allIPs || [];

    let results: IPRecord[] | null = null;

    if (activeSearch && searchResults) {
      results = searchResults;
    }
    if (categoryFilter !== 'all' && categoryResults) {
      results = results
        ? results.filter(r => categoryResults.some(cr => cr.id === r.id))
        : categoryResults;
    }
    if (activeJurisdiction && jurisdictionResults) {
      results = results
        ? results.filter(r => jurisdictionResults.some(jr => jr.id === r.id))
        : jurisdictionResults;
    }

    return results || [];
  }, [isFiltered, allIPs, activeSearch, searchResults, categoryFilter, categoryResults, activeJurisdiction, jurisdictionResults]);

  const handleSearch = () => {
    setActiveSearch(searchInput);
    setActiveJurisdiction(jurisdictionFilter);
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setActiveSearch('');
    setCategoryFilter('all');
    setJurisdictionFilter('');
    setActiveJurisdiction('');
    setPage(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'oklch(0.78 0.14 85 / 0.15)' }}
          >
            <Database className="w-5 h-5" style={{ color: 'oklch(0.78 0.14 85)' }} />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Global IP Database</h1>
            <p className="text-sm text-muted-foreground">Publicly accessible — no login required</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div
        className="rounded-xl p-5 mb-8"
        style={{ backgroundColor: 'oklch(0.16 0.025 240)', border: '1px solid oklch(0.28 0.03 240)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4" style={{ color: 'oklch(0.78 0.14 85)' }} />
          <span className="text-sm font-medium text-foreground">Search & Filter</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by title..."
              className="bg-charcoal border-border text-foreground placeholder:text-muted-foreground pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as IPCategory | 'all')}>
            <SelectTrigger className="bg-charcoal border-border text-foreground">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent style={{ backgroundColor: 'oklch(0.18 0.025 240)', borderColor: 'oklch(0.28 0.03 240)' }}>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value={IPCategory.patent}>Patent</SelectItem>
              <SelectItem value={IPCategory.trademark}>Trademark</SelectItem>
              <SelectItem value={IPCategory.copyright}>Copyright</SelectItem>
            </SelectContent>
          </Select>

          <Input
            value={jurisdictionFilter}
            onChange={(e) => setJurisdictionFilter(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Filter by jurisdiction..."
            className="bg-charcoal border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSearch}
            className="font-semibold gap-2"
            style={{ backgroundColor: 'oklch(0.78 0.14 85)', color: 'oklch(0.10 0.02 240)' }}
          >
            <Search className="w-4 h-4" />
            Search
          </Button>
          {isFiltered && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="border-border text-foreground hover:bg-charcoal gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'oklch(0.78 0.14 85)' }} />
          <p className="text-muted-foreground">Loading IP records...</p>
        </div>
      ) : displayedRecords.length === 0 ? (
        <div className="text-center py-20">
          <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
            {isFiltered ? 'No matching records found' : 'No IP records yet'}
          </h3>
          <p className="text-muted-foreground text-sm">
            {isFiltered
              ? 'Try adjusting your search filters.'
              : 'Be the first to register intellectual property on the IPGT blockchain.'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {isFiltered
                ? `${displayedRecords.length} result${displayedRecords.length !== 1 ? 's' : ''} found`
                : `Showing ${page * PAGE_SIZE + 1}–${page * PAGE_SIZE + displayedRecords.length} records`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedRecords.map((record) => (
              <IPCard
                key={record.id.toString()}
                record={record}
                onClick={(r) => setSelectedId(r.id)}
              />
            ))}
          </div>

          {/* Pagination (only for non-filtered view) */}
          {!isFiltered && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="border-border text-foreground hover:bg-charcoal gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-3">
                Page {page + 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={(allIPs?.length || 0) < PAGE_SIZE}
                className="border-border text-foreground hover:bg-charcoal gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <IPDetailModal
        recordId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
