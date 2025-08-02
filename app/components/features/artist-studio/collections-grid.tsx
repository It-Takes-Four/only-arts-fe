import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { Button } from "../../common/button";
import { Pagination, type PaginationData, type PaginationDataAlt } from "../../common/pagination";
import { CollectionManagementCard } from "./collection-management-card";
import { EditCollectionContentModal } from "./edit-collection-content-modal";
import { EditCollectionCoverModal } from "./edit-collection-cover-modal";
import { PublishCollectionModal } from "./publish-collection-modal";
import { ManageCollectionArtsModal } from "./manage-collection-arts-modal";
import { collectionService } from "../../../services/collection-service";
import type { MyCollection } from "../../../types/collection";

interface CollectionsGridProps {
  collections: MyCollection[];
  collectionsLoading: boolean;
  pagination?: PaginationData | PaginationDataAlt;
  onCreateCollection: () => void;
  onCollectionUpdated: (updatedCollection: MyCollection) => void;
  onPageChange?: (page: number) => void;
  publishCollection: (collectionId: string) => void;
  publishCollectionIsPending: boolean;
  publishCollectionIsSuccess: boolean;
}

export function CollectionsGrid({
  collections,
  collectionsLoading,
  pagination,
  onCreateCollection,
  onCollectionUpdated,
  onPageChange,
  publishCollection,
  publishCollectionIsPending,
  publishCollectionIsSuccess
}: CollectionsGridProps) {
  const [editingCollection, setEditingCollection] = useState<MyCollection | null>(null);
  const [editingCoverCollection, setEditingCoverCollection] = useState<MyCollection | null>(null);
  const [publishingCollection, setPublishingCollection] = useState<MyCollection | null>(null);
  const [managingArtsCollection, setManagingArtsCollection] = useState<MyCollection | null>(null);

  const handleContentEdit = (collection: MyCollection) => {
    setEditingCollection(collection);
  };

  const handleCoverEdit = (collection: MyCollection) => {
    setEditingCoverCollection(collection);
  };

  const handlePublish = (collection: MyCollection) => {
    setPublishingCollection(collection);
  };

  const handleManageArts = (collection: MyCollection) => {
    setManagingArtsCollection(collection);
  };

  const handleContentUpdated = async (updatedData: { collectionName: string; description: string; price?: number }) => {
    if (editingCollection) {
      // Optimistic update
      const optimisticCollection = {
        ...editingCollection,
        collectionName: updatedData.collectionName,
        description: updatedData.description,
        price: updatedData.price?.toString() || editingCollection.price,
        updatedAt: new Date().toISOString()
      };
      onCollectionUpdated(optimisticCollection);
      setEditingCollection(null);

      // Refresh collections to get server state
      try {
        const freshCollection = await collectionService.getCollectionById(editingCollection.id);
        onCollectionUpdated(freshCollection);
      } catch (error) {
        console.error('Failed to refresh collection after content update:', error);
      }
    }
  };

  const handleCoverUpdated = async () => {
    if (editingCoverCollection) {
      // For cover image, fetch fresh data since we need the new file ID
      try {
        const updatedCollection = await collectionService.getCollectionById(editingCoverCollection.id);
        onCollectionUpdated(updatedCollection);
        setEditingCoverCollection(null);
      } catch (error) {
        console.error('Failed to fetch updated collection:', error);
        toast.error('Failed to refresh collection data');
      }
    }
  };

  const handlePublished = async () => {
    setPublishingCollection(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Collections</h2>
          <Button
            className="flex items-center gap-2"
            onClick={onCreateCollection}
          >
            <PlusIcon className="h-4 w-4" />
            Create Collection
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Create New Collection Card */}
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] hover:border-muted-foreground/50 transition-colors cursor-pointer"
            onClick={onCreateCollection}
          >
            <PlusIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Create New Collection</p>
          </div>

          {/* Loading State */}
          {collectionsLoading && (
            <>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-muted rounded-lg aspect-[4/3] mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </>
          )}

          {/* Collection Cards */}
          {!collectionsLoading && collections.map((collection) => (
            <CollectionManagementCard
              key={collection.id}
              collection={collection}
              onCollectionUpdated={onCollectionUpdated}
              onEditContent={handleContentEdit}
              onEditCover={handleCoverEdit}
              onPublish={handlePublish}
              onManageArts={handleManageArts}
            />
          ))}
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

      {/* Modals */}
      {editingCollection && (
        <EditCollectionContentModal
          isOpen={true}
          onClose={() => setEditingCollection(null)}
          collection={editingCollection}
          onSuccess={handleContentUpdated}
        />
      )}

      {editingCoverCollection && (
        <EditCollectionCoverModal
          isOpen={true}
          onClose={() => setEditingCoverCollection(null)}
          collection={editingCoverCollection}
          onSuccess={handleCoverUpdated}
        />
      )}

      {publishingCollection && (
        <PublishCollectionModal
          isOpen={true}
          onClose={() => setPublishingCollection(null)}
          collection={publishingCollection}
          onSuccess={handlePublished}
          publishCollection={publishCollection}
          publishCollectionIsPending={publishCollectionIsPending}
          publishCollectionIsSuccess={publishCollectionIsSuccess}
        />
      )}

      {managingArtsCollection && (
        <ManageCollectionArtsModal
          isOpen={true}
          onClose={() => setManagingArtsCollection(null)}
          collection={managingArtsCollection}
          onCollectionUpdated={onCollectionUpdated}
        />
      )}
    </>
  );
}
