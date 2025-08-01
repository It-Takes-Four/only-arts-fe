import BaseService from './base-service';
import type { User, Artist } from 'app/components/core/_models';
import type { ArtistRegistrationRequest, ArtistRegistrationResponse, ArtistProfile } from "../types/artist";

class ArtistService extends BaseService {
  async registerAsArtist(artistData: ArtistRegistrationRequest): Promise<ArtistRegistrationResponse> {
    try {
      const { data } = await this._axios.post<ArtistRegistrationResponse>('/artists/register-as-artist', artistData);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to register as artist');
    }
  }

  async getArtistProfile(artistId: string): Promise<ArtistProfile> {
    try {
      const { data } = await this._axios.get<ArtistProfile>(`/artists/${artistId}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get artist profile');
    }
  }

  async updateArtistProfile(artistData: Partial<ArtistRegistrationRequest>): Promise<ArtistProfile> {
    try {
      const { data } = await this._axios.patch<ArtistProfile>('/artists/me', artistData);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update artist profile');
    }
  }

  async getMyArtistProfile(): Promise<ArtistProfile> {
    try {
      const { data } = await this._axios.get<ArtistProfile>('/artists/me');
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get artist profile');
    }
  }

  async updateWalletAddress(walletAddress: string): Promise<ArtistProfile> {
    try {
      const { data } = await this._axios.patch<ArtistProfile>('/artists/me/wallet', {
        walletAddress
      });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update wallet address');
    }
  }

  async getArtistCollections(artistId: string, page: number = 1, limit: number = 10) {
    try {
      const { data } = await this._axios.get(`/art-collections/artist/${artistId}`, {
        params: { page, limit }
      });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get artist collections');
    }
  }

  async getArtistArtworks(artistId: string) {
    try {
      const { data } = await this._axios.get(`/art/artist/${artistId}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get artist artworks');
    }
  }

  // Helper method to get user profile picture URL
  getProfilePictureUrl(profilePictureFileId: string): string {
    return `${import.meta.env.VITE_API_BASE_URL}/upload/profile/${profilePictureFileId}`;
  }
}

export const artistService = new ArtistService();
