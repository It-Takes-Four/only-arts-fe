import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '../components/core/auth-context';
import { useMyCollectionsQuery } from '../components/hooks/useMyCollectionsQuery';
import { useMyArtworksQuery } from '../components/hooks/useMyArtworksQuery';
import { useArtistProfileQuery } from '../components/hooks/useArtistProfileQuery';
import { useUserProfileQuery } from '../components/hooks/useUserProfileQuery';
import type { MyArtwork } from 'app/types/collection';

interface ArtistStudioContextType {
  // Collections
  collections: any[];
  collectionsLoading: boolean;
  addCollection: (collectionData: any) => void;
  updateCollection: (updatedCollection: any) => void;
  refreshCollections: () => void;
  isCreatingCollection: boolean;
  isDoneCreatingCollection: boolean;

  // Artworks
  artworks: any[];
  artworksLoading: boolean;
  addArtwork: (artwork: MyArtwork) => void;
  refreshArtworks: () => void;

  // Artwork mutations
  createArtwork: (artworkData: any) => void;
  createArtworkAsync: (artworkData: any) => Promise<any>;
  isCreatingArtwork: boolean;
  createArtworkError: Error | null;

  updateArtwork: (params: { id: string; data: any }) => void;
  updateArtworkAsync: (params: { id: string; data: any }) => Promise<any>;
  isUpdatingArtwork: boolean;

  deleteArtwork: (artworkId: string) => void;
  deleteArtworkAsync: (artworkId: string) => Promise<any>;
  isDeletingArtwork: boolean;

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
  const { collections, isLoading: collectionsLoading, addCollection, updateCollection, refresh: refreshCollections, addCollectionStatus: { isPending, isSuccess } } = useMyCollectionsQuery();
  const {
    artworks,
    isLoading: artworksLoading,
    addArtwork,
    refresh: refreshArtworks,
    createArtwork,
    createArtworkAsync,
    isCreatingArtwork,
    createArtworkError,
    updateArtwork,
    updateArtworkAsync,
    isUpdatingArtwork,
    deleteArtwork,
    deleteArtworkAsync,
    isDeletingArtwork
  } = useMyArtworksQuery();
  const { refresh: refreshArtistProfile, artist } = useArtistProfileQuery();
  const { refresh: refreshUserProfile } = useUserProfileQuery();

  // Calculate analytics from real data
  const analytics = {
    totalViews: 0, // This would need a separate API call to get view counts
    totalLikes: 0, // Likes count not available in new API response
    totalShares: 0, // This would need a separate API call to get share counts
    totalSales: 0, // Sales data not available in current API response
    revenue: 0, // Revenue data not available in current API response
    totalArtworks: artist?.totalArts,
    publishedCollections: artist?.totalPublishedCollections,
    totalCollections: artist?.totalCollections
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
    updateCollection,
    refreshCollections,
    isCreatingCollection: isPending,
    isDoneCreatingCollection: isSuccess,

    artworks,
    artworksLoading,
    addArtwork,
    refreshArtworks,

    // Artwork mutations
    createArtwork,
    createArtworkAsync,
    isCreatingArtwork,
    createArtworkError,
    updateArtwork,
    updateArtworkAsync,
    isUpdatingArtwork,
    deleteArtwork,
    deleteArtworkAsync,
    isDeletingArtwork,

    

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