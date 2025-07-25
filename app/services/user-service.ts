import BaseService from './base-service';
import type { User } from 'app/components/core/_models';

class UserService extends BaseService {
  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await this._axios.get<User>('/users/me');
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get current user');
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const { data } = await this._axios.put<User>('/users/me', userData);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  async uploadProfilePicture(file: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      this.setMultipartFormDataHeaders();
      const { data } = await this._axios.post<User>('/users/me/profile-picture', formData);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload profile picture');
    }
  }
}

// Export singleton instance
export const userService = new UserService();
