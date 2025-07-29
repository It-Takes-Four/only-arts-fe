import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useTags } from '../hooks/useTags';
import { Badge } from '@/components/ui/badge';
import { Button } from './button';
import { Input } from '@/components/ui/input';
import type { Tag } from '../../services/tags-service';

interface TagSelectorProps {
  selectedTagId?: string;
  onTagSelect: (tagId: string | undefined) => void;
}

export function TagSelector({ selectedTagId, onTagSelect }: TagSelectorProps) {
  const { tags, popularTags, loading, searchTags, loadPopularTags } = useTags();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
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

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      // Use popular search for better results
      loadPopularTags(value);
      setShowSearch(true);
    } else {
      // Load default popular tags when search is cleared
      loadPopularTags();
      setShowSearch(false);
    }
  };

  const handleTagClick = (tag: Tag) => {
    if (selectedTagId === tag.id) {
      onTagSelect(undefined); // Deselect if already selected
    } else {
      onTagSelect(tag.id);
    }
    setShowSearch(false);
    setSearchQuery('');
    setIsSearchExpanded(false);
    // Clear search and reload popular tags
    loadPopularTags();
  };

  const clearSelection = () => {
    onTagSelect(undefined);
    setShowSearch(false);
    setSearchQuery('');
    setIsSearchExpanded(false);
    loadPopularTags();
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setShowSearch(true);
    } else {
      setShowSearch(false);
      setSearchQuery('');
      loadPopularTags();
    }
  };

  const displayTags = popularTags; // Always use popular tags since we're searching within them
  const selectedTag = popularTags.find(tag => tag.id === selectedTagId);

  return (
    <motion.div
      className="sticky top-16 z-20 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="space-y-3">
            {/* First Row: Selected Tag + Search Toggle */}
            <div className="flex items-center justify-between gap-3">
              {/* Selected Tag or Title */}
              <div className="flex-1 min-w-0">
                {selectedTag ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge 
                      variant="default" 
                      className="cursor-pointer hover:bg-primary/90 transition-colors shadow-sm text-sm px-3 py-1"
                      onClick={clearSelection}
                    >
                      {selectedTag.tagName}
                      <X className="h-3 w-3 ml-2" />
                    </Badge>
                  </motion.div>
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">Filter by Tags</span>
                )}
              </div>

              {/* Search Toggle Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSearch}
                className="h-8 w-8 p-0"
              >
                {isSearchExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Popular Tags Row */}
            {!isSearchExpanded && (
              <div className="flex flex-wrap gap-2 items-center">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="w-1.5 h-1.5 bg-primary rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-xs text-muted-foreground">Loading...</span>
                  </div>
                ) : displayTags.length > 0 ? (
                  displayTags.slice(0, 6).map((tag, index) => (
                    <motion.div
                      key={tag.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.15, delay: index * 0.03 }}
                    >
                      <Badge
                        variant={selectedTagId === tag.id ? "default" : "secondary"}
                        className={`cursor-pointer transition-all duration-200 text-xs px-2 py-1 hover:scale-105 ${
                          selectedTagId === tag.id 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'hover:bg-primary/10 hover:text-primary bg-background/60'
                        }`}
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag.tagName}
                      </Badge>
                    </motion.div>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No tags</span>
                )}
                
                {displayTags.length > 6 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSearch}
                    className="text-xs text-muted-foreground hover:text-primary px-2 py-1 h-auto"
                  >
                    +{displayTags.length - 6} more
                  </Button>
                )}
              </div>
            )}

            {/* Expandable Search Section */}
            <AnimatePresence>
              {isSearchExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tags..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-9 h-9 bg-background/60 border-border/60 text-sm focus:bg-background"
                      autoFocus
                    />
                  </div>

                  {/* Search Results */}
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {displayTags.map((tag, index) => (
                      <motion.div
                        key={tag.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15, delay: index * 0.02 }}
                      >
                        <Badge
                          variant={selectedTagId === tag.id ? "default" : "secondary"}
                          className={`cursor-pointer transition-all duration-200 text-xs px-2 py-1 hover:scale-105 ${
                            selectedTagId === tag.id 
                              ? 'bg-primary text-primary-foreground shadow-sm' 
                              : 'hover:bg-primary/10 hover:text-primary bg-background/60'
                          }`}
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag.tagName}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="flex items-center gap-3">
            {/* Selected Tag Display */}
            {selectedTag && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center"
              >
                <Badge 
                  variant="default" 
                  className="cursor-pointer hover:bg-primary/90 transition-colors shadow-sm"
                  onClick={clearSelection}
                >
                  {selectedTag.tagName}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              </motion.div>
            )}

            {/* Search Input */}
            <div className="flex-1 max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 h-8 bg-background/60 border-border/60 text-sm focus:bg-background"
                  onFocus={() => setShowSearch(true)}
                />
              </div>
            </div>

            {/* Popular Tags */}
            <div className="flex-1 flex flex-wrap gap-1.5 items-center overflow-hidden">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <motion.div
                    className="w-1.5 h-1.5 bg-primary rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-xs text-muted-foreground">Loading...</span>
                </div>
              ) : displayTags.length > 0 ? (
                displayTags.slice(0, 8).map((tag, index) => (
                  <motion.div
                    key={tag.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15, delay: index * 0.03 }}
                  >
                    <Badge
                      variant={selectedTagId === tag.id ? "default" : "secondary"}
                      className={`cursor-pointer transition-all duration-200 text-xs px-2 py-1 hover:scale-105 ${
                        selectedTagId === tag.id 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'hover:bg-primary/10 hover:text-primary bg-background/60'
                      }`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag.tagName}
                    </Badge>
                  </motion.div>
                ))
              ) : searchQuery.trim() ? (
                <span className="text-xs text-muted-foreground">No results</span>
              ) : (
                <span className="text-xs text-muted-foreground">No tags</span>
              )}
              
              {displayTags.length > 8 && !searchQuery && (
                <span className="text-xs text-muted-foreground">
                  +{displayTags.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Desktop Expanded Search Results */}
        {!isMobile && showSearch && searchQuery && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-border/30"
          >
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {displayTags.map((tag, index) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                >
                  <Badge
                    variant={selectedTagId === tag.id ? "default" : "secondary"}
                    className={`cursor-pointer transition-all duration-200 text-xs px-2 py-1 hover:scale-105 ${
                      selectedTagId === tag.id 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'hover:bg-primary/10 hover:text-primary bg-background/60'
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag.tagName}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
