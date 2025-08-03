import { motion } from "framer-motion";
import type { SearchResponse } from "../../../types/search";
import { ArtCard } from "../art/art-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../../common/button";
import { collectionService } from "../../../services/collection-service";
import { artistService } from "../../../services/artist-service";
import { transformArtworkTagsForArtCard } from "../../../utils/tag-helpers";
import { useNavigate } from "react-router";
import { formatPriceDisplay } from "../../../utils/currency";
import { CollectionCard } from "../collection/collection-card";

interface SearchResultsAllProps {
  searchResults: SearchResponse;
}

export function SearchResultsAll({ searchResults }: SearchResultsAllProps) {
  const navigate = useNavigate();
  const { arts, collections, artists } = searchResults;

  const hasResults = arts.length > 0 || collections.length > 0 || artists.length > 0;

  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No results found</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Arts Section */}
      {arts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Arts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {arts.slice(0, 8).map((art) => (
              <div key={art.id} className="relative">
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
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Collections Section */}
      {collections.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Collections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.slice(0, 8).map((collection) => (
              <div key={collection.id} className="relative">
                <CollectionCard
                  id={collection.id}
                  name={collection.collectionName}
                  description={collection.description || "No description"}
                  artworkCount={collection.artsCount}
                  previewImage={collection.coverImageFileId 
                    ? collectionService.getCollectionImageUrl(collection.coverImageFileId) 
                    : "/placeholder.svg"
                  }
                  createdBy={collection.artist.artistName}
                  price={collection.price || '0'}
                />
                {collection.isPublished && parseFloat(collection.price || '0') > 0 && (
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      className="bg-primary/90 hover:bg-primary shadow-lg"
                      onClick={() => {
                        // Handle collection purchase
                        console.log('Buy collection:', collection.id);
                      }}
                    >
                      Buy {formatPriceDisplay(collection.price || '0')}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Artists Section */}
      {artists.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Artists</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artists.slice(0, 8).map((artist) => (
              <motion.div
                key={artist.id}
                className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow cursor-pointer"
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
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{artist.totalFollowers} followers</span>
                  <span>{artist.totalArts} artworks</span>
                  <span>{artist.totalCollections} collections</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
