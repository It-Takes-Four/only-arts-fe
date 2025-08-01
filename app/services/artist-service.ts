import BaseService from './base-service';
import type { User, Artist } from 'app/components/core/_models';
import type { ArtistRegistrationRequest, ArtistRegistrationResponse } from "../types/artist";

class ArtistService extends BaseService {
  async registerAsArtist(artistData: ArtistRegistrationRequest): Promise<ArtistRegistrationResponse> {
    try {
      const { data } = await this._axios.post<ArtistRegistrationResponse>('/artists/register-as-artist', artistData);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to register as artist');
    }
  }

  async getArtistProfile(artistId: string): Promise<Artist> {
    try {
      const { data } = await this._axios.get<Artist>(`/artists/${artistId}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get artist profile');
    }
  }

  async updateArtistProfile(artistData: Partial<ArtistRegistrationRequest>): Promise<Artist> {
    try {
      const { data } = await this._axios.patch<Artist>('/artists/me', artistData);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update artist profile');
    }
  }

  async getMyArtistProfile(): Promise<Artist> {
    try {
      const { data } = await this._axios.get<Artist>('/artists/me');
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get artist profile');
    }
  }
}

export const artistService = new ArtistService();
