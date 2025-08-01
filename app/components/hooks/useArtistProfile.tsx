import { useState, useEffect } from 'react';
import { artistService } from '../../services/artist-service';
import type { ArtistProfile } from '../../types/artist';

export function useArtistProfile(artistId?: string) {
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let artistData: ArtistProfile;
        if (artistId) {
          artistData = await artistService.getArtistProfile(artistId);
        } else {
          artistData = await artistService.getMyArtistProfile();
        }
        
        setArtist(artistData);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch artist profile');
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId]);

  const refresh = () => {
    setArtist(null);
    setLoading(true);
    setError(null);
    // Re-trigger the effect
    const fetchArtist = async () => {
      try {
        let artistData: ArtistProfile;
        if (artistId) {
          artistData = await artistService.getArtistProfile(artistId);
        } else {
          artistData = await artistService.getMyArtistProfile();
        }
        setArtist(artistData);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch artist profile');
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  };

  return { artist, loading, error, refresh };
}
