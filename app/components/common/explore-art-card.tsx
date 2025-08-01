import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Folder } from "lucide-react";
import { AuthenticatedImage } from './authenticated-image';
import type { ExploreArtwork } from '../../pages/explore/core/explore-models';

interface ExploreArtCardProps {
  artwork: ExploreArtwork;
  index: number;
  isSingleColumn?: boolean;
}

export function ExploreArtCard({ artwork, index, isSingleColumn = false }: ExploreArtCardProps) {
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

  const getUserInitials = (artistName: string) => {
    if (!artistName) return "?";
    const parts = artistName.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }

  const getArtistProfileImageUrl = () => {
    if (artwork.artistProfileFileId) {
      return `${import.meta.env.VITE_API_BASE_URL}/upload/profile/${artwork.artistProfileFileId}`;
    }
    return null;
  };

  // Optimized staggered animation for grid items
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };

  const overlayVariants = {
    hidden: { 
      opacity: 0
    },
    visible: { 
      opacity: 1
    }
  };

  const buttonVariants = {
    hidden: { 
      y: 10, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1
    }
  };

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-lg sm:rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 ${
        isSingleColumn ? 'max-w-md mx-auto' : ''
      }`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ 
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onHoverStart={() => !isMobile && setIsHovered(true)}
      onHoverEnd={() => !isMobile && setIsHovered(false)}
      whileHover={{ 
        y: isMobile ? 0 : -4,
        transition: { duration: 0.15, ease: "easeOut" }
      }}
      style={{ willChange: 'transform' }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] sm:aspect-[3/4] overflow-hidden">
        <AuthenticatedImage 
          imageFileId={artwork.imageFileId}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ willChange: 'transform' }}
        />
        
        {/* Collection indicator */}
        {artwork.isInACollection && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="p-1.5 sm:p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50"
            >
              <Folder className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            </motion.div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/60 flex items-center justify-center"
          variants={overlayVariants}
          initial="hidden"
          animate={isHovered ? "visible" : "hidden"}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="flex space-x-2 sm:space-x-4"
            variants={buttonVariants}
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            transition={{ 
              duration: 0.2,
              ease: "easeOut"
            }}
          >
            <motion.button
              className="p-2 sm:p-3 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              className="p-2 sm:p-3 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <motion.button
              className="p-2 sm:p-3 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 hover:bg-primary hover:text-primary-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Artist Info */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link to={`/artist/${artwork.artistId}`} className="shrink-0">
            <Avatar className="w-7 h-7 sm:w-8 sm:h-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200">
              <AvatarImage 
                src={getArtistProfileImageUrl() || undefined}
                alt={artwork.artistName}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs sm:text-sm">
                {getUserInitials(artwork.artistName)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link 
              to={`/artist/${artwork.artistId}`}
              className="text-xs sm:text-sm font-medium text-foreground truncate hover:text-primary transition-colors duration-200 block"
            >
              {artwork.artistName}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatDate(artwork.datePosted)}
            </p>
          </div>
        </div>

        {/* Artwork Info */}
        <div className="space-y-1 sm:space-y-2">
          <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-2">
            {artwork.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {artwork.description}
          </p>
        </div>

        {/* Tags */}
        {artwork.tags && artwork.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {artwork.tags.slice(0, isMobile ? 2 : 3).map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {tag.tagName}
              </Badge>
            ))}
            {artwork.tags.length > (isMobile ? 2 : 3) && (
              <Badge
                variant="secondary"
                className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted/50 text-muted-foreground"
              >
                +{artwork.tags.length - (isMobile ? 2 : 3)}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-border/50">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">{artwork.likesCount}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {artwork.isInACollection && 'In Collection'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
