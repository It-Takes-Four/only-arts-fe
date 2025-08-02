import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../../common/button";
import { Pagination, type PaginationData, type PaginationDataAlt } from "../../common/pagination";
import { ArtCard } from "../art/art-card";
import { collectionService } from "../../../services/collection-service";
import type { MyArtwork } from "../../../types/collection";

interface ArtworksGridProps {
  artworks: MyArtwork[];
  artworksLoading: boolean;
  pagination?: PaginationData | PaginationDataAlt;
  onCreateArtwork: () => void;
  onPageChange?: (page: number) => void;
}

export function ArtworksGrid({ 
  artworks, 
  artworksLoading, 
  pagination,
  onCreateArtwork,
  onPageChange
}: ArtworksGridProps) {

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Artworks</h2>
          <Button
            className="flex items-center gap-2"
            onClick={onCreateArtwork}
          >
            <PlusIcon className="h-4 w-4" />
            Upload Artwork
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Create New Artwork Card */}
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] hover:border-muted-foreground/50 transition-colors cursor-pointer"
            onClick={onCreateArtwork}
          >
            <PlusIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Upload New Artwork</p>
          </div>

          {/* Loading State */}
          {artworksLoading && (
            <>
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-lg aspect-square mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </>
          )}

          {/* Artwork Cards */}
          {!artworksLoading && artworks.length > 0 && artworks.map((artwork) => (
            <div key={artwork.id} className="relative">
              <ArtCard
                art={{
                  id: artwork.id,
                  title: artwork.title,
                  description: artwork.description,
                  imageUrl: collectionService.getArtworkImageUrl(artwork.imageFileId),
                  artist: {
                    id: artwork.artist.id,
                    name: artwork.artist.artistName,
                    profilePicture: null // Not available in this API response
                  },
                  tags: artwork.tags.map((tag: any) => ({ name: tag.tagName })),
                  type: 'art',
                  createdAt: artwork.datePosted
                }}
              />
              {/* Artwork stats overlay */}
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white text-xs">
                <div className="flex items-center gap-1">
                  <span>♥ {artwork.likesCount || 0}</span>
                  {artwork.collections && artwork.collections.length > 0 && (
                    <span className="ml-2">In Collection</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {!artworksLoading && artworks.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No artworks yet. Upload your first artwork!</p>
              <Button
                className="mt-4"
                onClick={onCreateArtwork}
              >
                Upload Artwork
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && onPageChange && (
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
            className="mt-8"
          />
        )}
      </div>
    </>
  );
}
