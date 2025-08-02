import { motion } from "framer-motion";
import type { SearchArtist } from "../../../types/search";
import { Badge } from "@/components/ui/badge";
import { Button } from "../../common/button";
import { FollowButton } from "../../common/follow-button";
import { artistService } from "../../../services/artist-service";
import { useNavigate } from "react-router";

interface SearchResultsArtistsProps {
  artists: SearchArtist[];
  loading?: boolean;
}

export function SearchResultsArtists({ artists, loading }: SearchResultsArtistsProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-6 animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-muted rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
            <div className="h-3 bg-muted rounded mb-4" />
            <div className="flex justify-between">
              <div className="h-3 bg-muted rounded w-16" />
              <div className="h-3 bg-muted rounded w-16" />
              <div className="h-3 bg-muted rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No artists found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {artists.map((artist, index) => (
        <motion.div
          key={artist.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow cursor-pointer relative"
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate(`/artist/${artist.id}`)}
        >
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={artist.user.profilePictureFileId 
                ? artistService.getProfilePictureUrl(artist.user.profilePictureFileId)
                : "/placeholder-avatar.png"
              }
              alt={artist.artistName}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-avatar.png";
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{artist.artistName}</h3>
                {artist.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">@{artist.user.username}</p>
            </div>
          </div>
          
          {artist.bio && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {artist.bio}
            </p>
          )}
          
          <div className="flex justify-between text-sm text-muted-foreground mb-4">
            <span>{artist.totalFollowers} followers</span>
            <span>{artist.totalArts} artworks</span>
            <span>{artist.totalCollections} collections</span>
          </div>

          <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
            <FollowButton
              artistId={artist.id}
              size={16}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
