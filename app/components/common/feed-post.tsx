import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { FeedPost } from '../../types/feed';

interface FeedPostComponentProps {
  post: FeedPost;
}

export function FeedPostComponent({ post }: FeedPostComponentProps) {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const getUserInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  const getUserProfileImageUrl = () => {
    if (post.artist.user.profilePictureFileId) {
      return `${import.meta.env.VITE_API_BASE_URL}/upload/profile/${post.artist.user.profilePictureFileId}`;
    }
    return null;
  };

  return (
    <Card className="w-full mb-6 bg-background/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getUserProfileImageUrl() || undefined} alt={post.artist.user.username} />
            <AvatarFallback>{getUserInitials(post.artist.user.username)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-semibold text-foreground">
                {post.artist.user.username}
              </p>
              <span className="text-xs text-muted-foreground">•</span>
              <p className="text-xs text-muted-foreground">
                {formatDate(post.datePosted)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            {post.title}
          </h3>
          
          <div className="prose prose-sm max-w-none text-foreground">
            {post.content.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-2 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          {post.imageUrl && (
            <div className="mt-4">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full max-w-2xl rounded-lg object-cover shadow-lg"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
