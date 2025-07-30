import { useState, useEffect, useCallback } from 'react';
import { feedService, type UnifiedFeedItem } from '../../services/feed-service';

interface UseUnifiedFeedReturn {
  feeds: UnifiedFeedItem[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
}

interface UseUnifiedFeedOptions {
  tagId?: string;
}

export function useUnifiedFeed(options: UseUnifiedFeedOptions = {}): UseUnifiedFeedReturn {
  const { tagId } = options;
  const [feeds, setFeeds] = useState<UnifiedFeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadFeeds = useCallback(async (currentPage: number, isRefresh: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await feedService.getUnifiedFeeds(currentPage, 10, tagId);
      
      if (isRefresh) {
        setFeeds(response.data);
      } else {
        setFeeds(prev => [...prev, ...response.data]);
      }
      
      // Check if we have more data
      const totalLoaded = isRefresh ? response.data.length : feeds.length + response.data.length;
      setHasMore(totalLoaded < response.total);
      
    } catch (err) {
      console.error('Error loading unified feeds:', err);
      setError(err instanceof Error ? err.message : 'Failed to load feeds');
    } finally {
      setLoading(false);
    }
  }, [loading, feeds.length, tagId]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadFeeds(nextPage);
  }, [hasMore, loading, page, loadFeeds]);

  const refresh = useCallback(() => {
    setPage(1);
    setHasMore(true);
    loadFeeds(1, true);
  }, [loadFeeds]);

  // Load initial data and refresh when tagId changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    loadFeeds(1, true);
  }, [tagId]);

  return {
    feeds,
    loading,
    hasMore,
    error,
    loadMore,
    refresh
  };
}
