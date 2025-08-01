import { useState, useEffect, useCallback } from 'react';
import { collectionService } from '../../services/collection-service';
import type { MyCollection } from '../../types/collection';

export function useMyCollections() {
  const [collections, setCollections] = useState<MyCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await collectionService.getMyCollections();
      setCollections(data);
    } catch (err) {
      console.error('Error loading collections:', err);
      setError(err instanceof Error ? err.message : 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCollection = useCallback((newCollection: MyCollection) => {
    setCollections(prev => [newCollection, ...prev]);
  }, []);

  const updateCollection = useCallback((updatedCollection: MyCollection) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === updatedCollection.id ? updatedCollection : collection
      )
    );
  }, []);

  const removeCollection = useCallback((collectionId: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== collectionId));
  }, []);

  // Load collections on mount
  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  return {
    collections,
    loading,
    error,
    loadCollections,
    addCollection,
    updateCollection,
    removeCollection,
  };
}
