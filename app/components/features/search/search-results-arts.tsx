import { motion } from "framer-motion";
import type { SearchArt } from "../../../types/search";
import { ArtCard } from "../../features/art/art-card";
import { collectionService } from "../../../services/collection-service";
import { artistService } from "../../../services/artist-service";
import { transformArtworkTagsForArtCard } from "../../../utils/tag-helpers";

interface SearchResultsArtsProps {
  arts: SearchArt[];
  loading?: boolean;
}

export function SearchResultsArts({ arts, loading }: SearchResultsArtsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
            <div className="w-full aspect-square bg-muted rounded-lg mb-4" />
            <div className="h-4 bg-muted rounded mb-2" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (arts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No artworks found</p>
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
      {arts.map((art, index) => (
        <motion.div
          key={art.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative"
        >
          <ArtCard
            art={{
              id: art.id,
              title: art.title,
              description: art.description,
              imageUrl: collectionService.getArtworkImageUrl(art.imageFileId),
              artist: {
                id: art.artist.id,
                name: art.artist.artistName,
                profilePicture: art.artist.user.profilePictureFileId
                  ? artistService.getProfilePictureUrl(art.artist.user.profilePictureFileId)
                  : null
              },
              tags: transformArtworkTagsForArtCard(
                art.tags.map(tag => ({ tagId: tag.tagId, tagName: tag.tagName })),
                art.id
              ),
              type: 'art',
              createdAt: art.datePosted
            }}
          />
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs flex items-center gap-2">
            <span className="flex items-center gap-1">
              ♥ {art.likesCount}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
