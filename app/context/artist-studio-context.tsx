import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '../components/core/auth-context';
import { useMyCollectionsQuery } from '../components/hooks/useMyCollectionsQuery';
import { useMyArtworksQuery } from '../components/hooks/useMyArtworksQuery';
import { useArtistProfileQuery } from '../components/hooks/useArtistProfileQuery';
import { useUserProfileQuery } from '../components/hooks/useUserProfileQuery';

interface ArtistStudioContextType {
  // Collections
  collections: any[];
  collectionsLoading: boolean;
  addCollection: (collection: any) => void;
  refreshCollections: () => void;

  // Artworks
  artworks: any[];
  artworksLoading: boolean;
  addArtwork: (artwork: any) => void;
  refreshArtworks: () => void;

  // Profile updates
  refreshProfile: () => Promise<void>;

  // Analytics (calculated from data)
  analytics: {
    totalViews: number;
    totalLikes: number;
    totalShares: number;
    totalSales: number;
    revenue: number;
    totalArtworks: number;
    publishedCollections: number;
    totalCollections: number;
  };
}

const ArtistStudioContext = createContext<ArtistStudioContextType | undefined>(undefined);

interface ArtistStudioProviderProps {
  children: React.ReactNode;
}

export function ArtistStudioProvider({ children }: ArtistStudioProviderProps) {
  const { refreshUserWithValidation } = useAuthContext();
  const { collections, isLoading: collectionsLoading, addCollection, refresh: refreshCollections } = useMyCollectionsQuery();
  const { artworks, isLoading: artworksLoading, addArtwork, refresh: refreshArtworks } = useMyArtworksQuery();
  const { refresh: refreshArtistProfile } = useArtistProfileQuery();
  const { refresh: refreshUserProfile } = useUserProfileQuery();
  const queryClient = useQueryClient();

  // Calculate analytics from real data
  const analytics = {
    totalViews: 0, // This would need a separate API call to get view counts
    totalLikes: artworks.reduce((sum: number, artwork: any) => sum + (artwork.likesCount || 0), 0),
    totalShares: 0, // This would need a separate API call to get share counts
    totalSales: 0, // Sales data not available in current API response
    revenue: 0, // Revenue data not available in current API response
    totalArtworks: artworks.length,
    publishedCollections: collections.filter((collection: any) => collection.isPublished).length,
    totalCollections: collections.length
  };

  const refreshProfile = useCallback(async () => {
    try {
      console.log('ArtistStudioProvider: Refreshing profile and related data...');

      // Refresh user data first
      await refreshUserWithValidation();

      // Refresh all related queries using React Query
      await Promise.all([
        refreshUserProfile(),
        refreshArtistProfile(),
        refreshCollections(),
        refreshArtworks()
      ]);

      console.log('ArtistStudioProvider: All data refreshed successfully');
    } catch (error) {
      console.error('ArtistStudioProvider: Failed to refresh profile data:', error);
      throw error;
    }
  }, [refreshUserWithValidation, refreshUserProfile, refreshArtistProfile, refreshCollections, refreshArtworks]);

  const contextValue: ArtistStudioContextType = {
    collections,
    collectionsLoading,
    addCollection,
    refreshCollections,
    artworks,
    artworksLoading,
    addArtwork,
    refreshArtworks,
    refreshProfile,
    analytics
  };

  return (
    <ArtistStudioContext.Provider value={contextValue}>
      {children}
    </ArtistStudioContext.Provider>
  );
}

export function useArtistStudio() {
  const context = useContext(ArtistStudioContext);
  if (context === undefined) {
    throw new Error('useArtistStudio must be used within an ArtistStudioProvider');
  }
  return context;
}
