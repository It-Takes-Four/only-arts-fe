import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/common/tabs";
import { FancyLoading } from "../../components/common/fancy-loading";
import { searchService } from "../../services/search-service";
import type { SearchResponse, SearchResultType, PaginatedSearchResponse, SearchArt, SearchCollection, SearchArtist } from "../../types/search";
import {
  SearchResultsAll,
  SearchResultsArts,
  SearchResultsCollections,
  SearchResultsArtists
} from "../../components/features/search";
import { Button } from "../../components/common/button";
import { ArrowLeft } from "lucide-react";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [paginatedResults, setPaginatedResults] = useState<{
    arts: PaginatedSearchResponse<SearchArt> | null;
    collections: PaginatedSearchResponse<SearchCollection> | null;
    artists: PaginatedSearchResponse<SearchArtist> | null;
  }>({
    arts: null,
    collections: null,
    artists: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SearchResultType>('all');

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      if (activeTab === 'all') {
        performSearchAll(query);
      } else {
        performSearchPaginated(query, activeTab as 'arts' | 'collections' | 'artists');
      }
    }
  }, [query, activeTab]);

  const performSearchAll = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Search query cannot be empty');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchService.searchAll(searchQuery);
      setSearchResults(results);
    } catch (err: any) {
      setError(err.message || 'Failed to search');
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const performSearchPaginated = async (searchQuery: string, type: 'arts' | 'collections' | 'artists', page: number = 1) => {
    if (!searchQuery.trim()) {
      setError('Search query cannot be empty');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchService.searchPaginated(searchQuery, type, page);
      setPaginatedResults(prev => ({
        ...prev,
        [type]: results
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to search');
      setPaginatedResults(prev => ({
        ...prev,
        [type]: null
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    const newTab = tab as SearchResultType;
    setActiveTab(newTab);
    // Clear previous results to show loading state
    if (newTab === 'all') {
      setSearchResults(null);
    } else {
      setPaginatedResults(prev => ({
        ...prev,
        [newTab]: null
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] xl:max-w-[1800px] 2xl:max-w-[2000px] mx-auto px-4 lg:px-6 xl:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <FancyLoading />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 mx-auto"
              >
                <span className="text-2xl">⚠️</span>
              </motion.div>
              <p className="text-lg font-medium text-destructive mb-2">
                Search Failed
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {error}
              </p>
            </div>
          </motion.div>
        )}

        {/* No Query State */}
        {!query && !isLoading && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 mx-auto"
              >
                <span className="text-2xl">🔍</span>
              </motion.div>
              <p className="text-lg font-medium mb-2">
                Start Your Search
              </p>
              <p className="text-sm text-muted-foreground">
                Search for artworks, collections, and artists to discover amazing content.
              </p>
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        {((activeTab === 'all' && searchResults) || 
          (activeTab === 'arts' && paginatedResults.arts) ||
          (activeTab === 'collections' && paginatedResults.collections) ||
          (activeTab === 'artists' && paginatedResults.artists)) && 
          !isLoading && query && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Results Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                Search Results for "{query}"
              </h1>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-8">
                <TabsTrigger value="all">
                  All
                </TabsTrigger>
                <TabsTrigger value="arts">
                  Arts
                </TabsTrigger>
                <TabsTrigger value="collections">
                  Collections
                </TabsTrigger>
                <TabsTrigger value="artists">
                  Artists
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {searchResults && <SearchResultsAll searchResults={searchResults} />}
              </TabsContent>

              <TabsContent value="arts">
                {paginatedResults.arts && <SearchResultsArts arts={paginatedResults.arts.data} />}
              </TabsContent>

              <TabsContent value="collections">
                {paginatedResults.collections && <SearchResultsCollections collections={paginatedResults.collections.data} />}
              </TabsContent>

              <TabsContent value="artists">
                {paginatedResults.artists && <SearchResultsArtists artists={paginatedResults.artists.data} />}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  );
}
