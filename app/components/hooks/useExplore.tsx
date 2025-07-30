import { useState, useEffect, useCallback } from 'react';
import { exploreService } from '../../services/explore-service';
import type { ExploreArtwork, ExploreFilters } from '../../pages/explore/core/explore-models';

interface UseExploreReturn {
  artworks: ExploreArtwork[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
}

export function useExplore(filters: ExploreFilters = {}): UseExploreReturn {
  const [artworks, setArtworks] = useState<ExploreArtwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadArtworks = useCallback(async (currentPage: number, isRefresh: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await exploreService.getExploreArtworks({
        ...filters,
        page: currentPage,
        limit: 10
      });
      
      if (isRefresh) {
        setArtworks(response.data);
      } else {
        setArtworks(prev => [...prev, ...response.data]);
      }
      
      // Check if we have more data
      const totalLoaded = isRefresh ? response.data.length : artworks.length + response.data.length;
      setHasMore(totalLoaded < response.total);
      
    } catch (err) {
      console.error('Error loading explore artworks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load artworks');
    } finally {
      setLoading(false);
    }
  }, [loading, artworks.length, filters]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadArtworks(nextPage);
    }
  }, [hasMore, loading, page, loadArtworks]);

  const refresh = useCallback(() => {
    setPage(1);
    setHasMore(true);
    loadArtworks(1, true);
  }, [loadArtworks]);

  // Initial load and reload when filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setArtworks([]);
    loadArtworks(1, true);
  }, [filters.tagId]); // Only depend on tagId changes

  return {
    artworks,
    loading,
    hasMore,
    error,
    loadMore,
    refresh
  };
}
