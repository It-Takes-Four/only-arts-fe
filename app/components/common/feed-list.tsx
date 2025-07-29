import { useFeed } from '../hooks/useFeed';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { FeedPostComponent } from './feed-post';
import { Loading } from './loading';
import { Button } from './button';

export function FeedList() {
  const { feeds, loading, hasMore, error, loadMore, refresh } = useFeed();
  const sentinelRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    threshold: 200
  });

  // Handle error state with no feeds
  if (error && feeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive mb-2">
            Failed to load feed
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {error}
          </p>
          <Button onClick={refresh} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Handle loading state with no feeds
  if (loading && feeds.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  // Handle empty state
  if (feeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground mb-2">
            No posts yet
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Be the first to share something amazing!
          </p>
          <Button onClick={refresh} variant="outline">
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-0">
      {/* Refresh button */}
      <div className="mb-6 flex justify-center">
        <Button 
          onClick={refresh} 
          variant="outline" 
          size="sm"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Feed'}
        </Button>
      </div>

      {/* Feed posts */}
      <div className="space-y-0">
        {feeds.map((post) => (
          <FeedPostComponent key={post.id} post={post} />
        ))}
      </div>

      {/* Loading indicator for infinite scroll */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          {loading ? (
            <Loading />
          ) : (
            <div className="text-sm text-muted-foreground">
              Scroll for more posts...
            </div>
          )}
        </div>
      )}

      {/* End of feed indicator */}
      {!hasMore && feeds.length > 0 && (
        <div className="flex justify-center py-8">
          <div className="text-sm text-muted-foreground">
            You've reached the end of the feed!
          </div>
        </div>
      )}

      {/* Error state for infinite scroll */}
      {error && feeds.length > 0 && (
        <div className="flex flex-col items-center py-8 space-y-2">
          <p className="text-sm text-destructive">
            Failed to load more posts
          </p>
          <Button onClick={loadMore} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
