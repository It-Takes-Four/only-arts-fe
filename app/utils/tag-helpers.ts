import type { ArtworkTag } from "../types/artwork";

/**
 * Transforms artwork tags to the format expected by ArtCard component
 */
export function transformArtworkTagsForArtCard(artworkTags: ArtworkTag[], artworkId: string) {
  return artworkTags.map((tag) => ({
    name: tag.tagName,
    artId: artworkId,
    tagId: tag.tagId,
    tag: {
      id: tag.tagId,
      tagName: tag.tagName
    }
  }));
}

/**
 * Simple tag transformation for basic use cases
 */
export function createSimpleTag(tagName: string) {
  return {
    name: tagName
  };
}
