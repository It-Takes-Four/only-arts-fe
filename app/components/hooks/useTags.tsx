import { useState, useEffect, useCallback } from 'react';
import { tagsService } from '../../services/tags-service';
import type { Tag } from "../../types/tag";

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPopularTags = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const popularTagsData = await tagsService.getPopularTags(20, search);
      setPopularTags(popularTagsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAllTags = useCallback(async (page: number = 1, limit: number = 100) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tagsService.getTags(page, limit);
      setTags(response.tags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchTags = useCallback(async (query: string) => {
    if (!query.trim()) {
      setTags([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const searchResults = await tagsService.searchTags(query, 20);
      setTags(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search tags');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPopularTags();
  }, [loadPopularTags]);

  return {
    tags,
    popularTags,
    loading,
    error,
    loadPopularTags,
    loadAllTags,
    searchTags
  };
}
