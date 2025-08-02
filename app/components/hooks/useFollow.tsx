import { FollowService } from "app/services/follow-service";
import { useState, useCallback, useEffect } from "react";

const followService = new FollowService();

export function useFollow(artistId: string) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const status = await followService.isFollowing(artistId);
      setIsFollowing(status);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  const follow = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await followService.follow(artistId);
      setIsFollowing(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  const unfollow = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await followService.unfollow(artistId);
      setIsFollowing(false);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    if (artistId) {
      fetchStatus();
    }
  }, [artistId, fetchStatus]);

  return {
    isFollowing,
    loading,
    error,
    follow,
    unfollow,
    refetch: fetchStatus,
  };
}
