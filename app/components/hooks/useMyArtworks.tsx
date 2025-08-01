import { useState, useEffect, useCallback } from 'react';
import { collectionService } from '../../services/collection-service';
import type { MyArtwork } from "../../types/collection";

export function useMyArtworks() {
  const [artworks, setArtworks] = useState<MyArtwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArtworks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await collectionService.getMyArtworks();
      setArtworks(data);
    } catch (err) {
      console.error('Error loading artworks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load artworks');
    } finally {
      setLoading(false);
    }
  }, []);

  const addArtwork = useCallback((newArtwork: MyArtwork) => {
    setArtworks(prev => [newArtwork, ...prev]);
  }, []);

  const updateArtwork = useCallback((updatedArtwork: MyArtwork) => {
    setArtworks(prev => 
      prev.map(artwork => 
        artwork.id === updatedArtwork.id ? updatedArtwork : artwork
      )
    );
  }, []);

  const removeArtwork = useCallback((artworkId: string) => {
    setArtworks(prev => prev.filter(artwork => artwork.id !== artworkId));
  }, []);

  // Load artworks on mount
  useEffect(() => {
    loadArtworks();
  }, [loadArtworks]);

  return {
    artworks,
    loading,
    error,
    loadArtworks,
    addArtwork,
    updateArtwork,
    removeArtwork,
  };
}
