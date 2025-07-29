import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Tag as TagIcon } from 'lucide-react';
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
  const { tags, popularTags, loading, searchTags } = useTags();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      searchTags(value);
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
  };

  const clearSelection = () => {
    onTagSelect(undefined);
  };

  const displayTags = searchQuery.trim() ? tags : popularTags;
  const selectedTag = [...popularTags, ...tags].find(tag => tag.id === selectedTagId);

  return (
    <motion.div
      className="sticky top-16 z-20 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TagIcon className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">Filter by Tags</h3>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedTag && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2"
                >
                  <span className="text-sm text-muted-foreground">Selected:</span>
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={clearSelection}
                  >
                    {selectedTag.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                </motion.div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Input */}
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 bg-background/50"
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {/* Tags List */}
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {loading ? (
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-sm text-muted-foreground">Loading tags...</span>
              </div>
            ) : displayTags.length > 0 ? (
              displayTags.map((tag, index) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Badge
                    variant={selectedTagId === tag.id ? "default" : "secondary"}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedTagId === tag.id 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'hover:bg-primary/10 hover:text-primary'
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag.name}
                    {tag.count && (
                      <span className="ml-1 text-xs opacity-70">
                        {tag.count}
                      </span>
                    )}
                  </Badge>
                </motion.div>
              ))
            ) : searchQuery.trim() ? (
              <span className="text-sm text-muted-foreground">No tags found for "{searchQuery}"</span>
            ) : (
              <span className="text-sm text-muted-foreground">No tags available</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
