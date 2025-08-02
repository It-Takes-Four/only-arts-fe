import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../common/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collectionService } from "../../../services/collection-service";
import { AddArtToCollectionModal } from "./add-art-to-collection-modal";
import { DeleteArtFromCollectionModal } from "./delete-art-from-collection-modal";
import type { MyCollection } from "../../../types/collection";

interface ManageCollectionArtsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: MyCollection;
  onCollectionUpdated: (updatedCollection: MyCollection) => void;
}

interface CollectionArt {
  id: string;
  title: string;
  description: string;
  imageFileId: string;
  tags: Array<{ tagId: string; tagName: string }>;
  datePosted: string;
}

export function ManageCollectionArtsModal({ 
  isOpen, 
  onClose, 
  collection, 
  onCollectionUpdated 
}: ManageCollectionArtsModalProps) {
  const [arts, setArts] = useState<CollectionArt[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddArtModal, setShowAddArtModal] = useState(false);
  const [deleteArt, setDeleteArt] = useState<CollectionArt | null>(null);

  // Load collection arts
  const loadCollectionArts = async () => {
    if (!isOpen) return;
    
    setLoading(true);
    try {
      const collectionData = await collectionService.getCollectionById(collection.id);
      setArts(collectionData.arts || []);
    } catch (error: any) {
      console.error('Failed to load collection arts:', error);
      toast.error("Failed to load collection arts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollectionArts();
  }, [isOpen, collection.id]);

  const handleArtAdded = async (newArt: any) => {
    // Add to local state optimistically
    setArts(prev => [...prev, newArt]);
    
    // Refresh collection data
    try {
      const updatedCollection = await collectionService.getCollectionById(collection.id);
      onCollectionUpdated(updatedCollection);
    } catch (error) {
      console.error('Failed to refresh collection after adding art:', error);
    }
  };

  const handleArtDeleted = async (artId: string) => {
    // Remove from local state optimistically
    setArts(prev => prev.filter(art => art.id !== artId));
    
    // Refresh collection data
    try {
      const updatedCollection = await collectionService.getCollectionById(collection.id);
      onCollectionUpdated(updatedCollection);
    } catch (error) {
      console.error('Failed to refresh collection after deleting art:', error);
    }
  };

  const handleClose = () => {
    setArts([]);
    setShowAddArtModal(false);
    setDeleteArt(null);
    onClose();
  };

  const canManageArts = !collection.isPublished;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <Card className="bg-background/95 backdrop-blur-sm border-border/50 h-full flex flex-col">
            <CardHeader className="pb-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ImagePlus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Manage Collection Arts</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">
                        {collection.collectionName}
                      </p>
                      {collection.isPublished && (
                        <Badge variant="secondary" className="text-xs">
                          Published
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canManageArts && (
                    <Button
                      onClick={() => setShowAddArtModal(true)}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Art
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : arts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 bg-muted/50 rounded-full mb-4">
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No arts in this collection</h3>
                  <p className="text-muted-foreground mb-4">
                    {canManageArts 
                      ? "Start building your collection by adding your first artwork"
                      : "This collection is published and cannot be modified"
                    }
                  </p>
                  {canManageArts && (
                    <Button
                      onClick={() => setShowAddArtModal(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add First Art
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {arts.map((art, index) => (
                      <motion.div
                        key={art.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {/* Art Image */}
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={collectionService.getArtworkImageUrl(art.imageFileId)}
                            alt={art.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>

                        {/* Art Info */}
                        <div className="p-3">
                          <h4 className="font-medium text-sm truncate mb-1">
                            {art.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {art.description}
                          </p>
                          
                          {/* Tags */}
                          {art.tags && art.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {art.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag.tagId}
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  {tag.tagName}
                                </Badge>
                              ))}
                              {art.tags.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-1 py-0"
                                >
                                  +{art.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Delete Button */}
                        {canManageArts && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setDeleteArt(art)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Warning for published collections */}
              {!canManageArts && arts.length > 0 && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground text-center">
                    This collection is published and cannot be modified. You can only view the arts.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add Art Modal */}
      {showAddArtModal && (
        <AddArtToCollectionModal
          isOpen={showAddArtModal}
          onClose={() => setShowAddArtModal(false)}
          collection={collection}
          onSuccess={handleArtAdded}
        />
      )}

      {/* Delete Art Modal */}
      {deleteArt && (
        <DeleteArtFromCollectionModal
          isOpen={!!deleteArt}
          onClose={() => setDeleteArt(null)}
          collection={collection}
          art={{
            id: deleteArt.id,
            title: deleteArt.title,
            imageUrl: collectionService.getArtworkImageUrl(deleteArt.imageFileId),
          }}
          onSuccess={handleArtDeleted}
        />
      )}
    </>
  );
}
