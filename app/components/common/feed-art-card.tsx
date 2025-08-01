import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import type { FeedPost } from '../../types/feed';

interface FeedArtCardProps {
  post: FeedPost;
  index: number;
  isSingleColumn?: boolean;
}

export function FeedArtCard({ post, index, isSingleColumn = false }: FeedArtCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const getUserProfileImageUrl = () => {
    if (post.artist.user.profilePictureFileId) {
      return `${import.meta.env.VITE_API_BASE_URL}/upload/profile/${post.artist.user.profilePictureFileId}`;
    }
    return null;
  };

  const getUserInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  // Staggered animation for grid items
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  // Show overlay based on hover state or mobile mode
  const showOverlay = isHovered || isMobile;

  const handleClick = () => {
    // TODO: Navigate to post detail page or open modal
    console.log('Clicked post:', post.id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Handle like functionality
    console.log('Liked post:', post.id);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Handle comment functionality
    console.log('Comment on post:', post.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Handle share functionality
    console.log('Share post:', post.id);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`group relative overflow-hidden ${isSingleColumn ? 'rounded-2xl' : 'rounded-xl'} cursor-pointer bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ 
        y: isSingleColumn ? -4 : -8,
        scale: isSingleColumn ? 1.01 : 1.02,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Section */}
      {post.imageUrl ? (
        <div className={`${isSingleColumn ? 'aspect-[16/9]' : 'aspect-square'} overflow-hidden`}>
          <motion.img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      ) : (
        // Only show text content if it has an image or if it's in single column mode
        isSingleColumn && (
          <div className="min-h-[200px] bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 flex items-center justify-center p-6">
            <div className="text-center space-y-3">
              <motion.h3 
                className="text-xl font-semibold text-foreground/90 leading-tight"
                animate={{ 
                  backgroundPosition: isHovered ? "200% center" : "0% center" 
                }}
                style={{
                  background: "linear-gradient(90deg, currentColor 0%, transparent 50%, currentColor 100%)",
                  backgroundSize: "200% 100%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text"
                }}
                transition={{ duration: 0.8 }}
              >
                {post.title}
              </motion.h3>
              <motion.p 
                className="text-base text-muted-foreground leading-relaxed"
                animate={{ opacity: isHovered ? 0.8 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {post.content.length > 300 
                  ? `${post.content.substring(0, 300)}...` 
                  : post.content}
              </motion.p>
            </div>
          </div>
        )
      )}

      {/* Only show content if there's an image or if it's in single column mode */}
      {(post.imageUrl || isSingleColumn) && (
        <>
          {/* Overlay with content */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent ${
              isMobile ? 'opacity-100' : ''
            }`}
            initial={{ opacity: isMobile ? 1 : 0 }}
            animate={{ opacity: showOverlay ? 1 : 0 }}
            transition={{ duration: isMobile ? 0 : 0.3 }}
          >
            {/* Artist info at top */}
            <motion.div
              className="absolute top-3 left-3 right-3 flex items-center space-x-2"
              initial={{ y: isMobile ? 0 : -20, opacity: isMobile ? 1 : 0 }}
              animate={{
                y: showOverlay ? 0 : -20,
                opacity: showOverlay ? 1 : 0
              }}
              transition={{ duration: isMobile ? 0 : 0.3, delay: isMobile ? 0 : 0.1 }}
            >
              <Avatar className="h-8 w-8 border-2 border-white/20">
                <AvatarImage src={getUserProfileImageUrl() || undefined} alt={post.artist.user.username} />
                <AvatarFallback className="text-xs">
                  {getUserInitials(post.artist.user.username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {post.artist.user.username}
                </p>
                <p className="text-white/70 text-xs">
                  {formatDate(post.datePosted)}
                </p>
              </div>
            </motion.div>

            {/* Content at bottom */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 text-white"
              initial={{ y: isMobile ? 0 : 20, opacity: isMobile ? 1 : 0 }}
              animate={{
                y: showOverlay ? 0 : 20,
                opacity: showOverlay ? 1 : 0
              }}
              transition={{ duration: isMobile ? 0 : 0.3, delay: isMobile ? 0 : 0.2 }}
            >
              <h3 className={`${isSingleColumn ? 'text-xl' : 'text-lg'} font-semibold mb-2 line-clamp-2`}>
                {post.title}
              </h3>
              
              {post.imageUrl && (
                <p className={`${isSingleColumn ? 'text-base' : 'text-sm'} text-white/90 mb-3 line-clamp-2`}>
                  {post.content}
                </p>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.button
                    className="flex items-center space-x-1 text-white/80 hover:text-red-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                  >
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">24</span>
                  </motion.button>
                  
                  <motion.button
                    className="flex items-center space-x-1 text-white/80 hover:text-blue-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleComment}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">5</span>
                  </motion.button>
                  
                  <motion.button
                    className="flex items-center space-x-1 text-white/80 hover:text-green-400 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Always visible bottom section for single column with images */}
          {post.imageUrl && isSingleColumn && (
            <div className="p-6 bg-background/90">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getUserProfileImageUrl() || undefined} alt={post.artist.user.username} />
                  <AvatarFallback className="text-sm">
                    {getUserInitials(post.artist.user.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-base font-medium truncate">
                    {post.artist.user.username}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(post.datePosted)}
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {post.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {post.content}
              </p>
            </div>
          )}

          {/* Always visible bottom section for single column text-only posts */}
          {!post.imageUrl && isSingleColumn && (
            <div className="p-6 bg-background/90">
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={getUserProfileImageUrl() || undefined} alt={post.artist.user.username} />
                  <AvatarFallback className="text-sm">
                    {getUserInitials(post.artist.user.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-base font-medium truncate">
                    {post.artist.user.username}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatDate(post.datePosted)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
