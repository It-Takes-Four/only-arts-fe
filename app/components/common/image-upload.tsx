import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  id?: string;
  label?: string;
  required?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
  error?: string;
  previewHeight?: string;
  placeholder?: {
    title: string;
    subtitle?: string;
  };
  onFileSelect: (file: File | null) => void;
  onFileChange?: (files: FileList | null) => void;
  register?: any; // react-hook-form register function
}

export function ImageUpload({
  id = "image-upload",
  label,
  required = false,
  accept = "image/*",
  maxSize = 10,
  className = "",
  disabled = false,
  error,
  previewHeight = "h-64",
  placeholder = {
    title: "Click to upload or drag and drop",
    subtitle: `PNG, JPG, GIF up to ${maxSize}MB`
  },
  onFileSelect,
  onFileChange,
  register
}: ImageUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File | null) => {
    if (file) {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        onFileSelect(null);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    } else {
      setPreviewImage(null);
      onFileSelect(null);
    }
  }, [onFileSelect, maxSize]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files?.[0] || null;
    
    if (onFileChange) {
      onFileChange(files);
    }
    
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return;
      }

      // Update the file input
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInputRef.current.files = dt.files;
        
        // Trigger change event for react-hook-form
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }

      if (onFileChange) {
        const fileList = files;
        onFileChange(fileList);
      }

      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    handleFileSelect(null);
    if (onFileChange) {
      onFileChange(null);
    }
  };

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={id}>
          {label} {required && "*"}
        </Label>
      )}
      
      <div className="space-y-3">
        {previewImage ? (
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className={`w-full ${previewHeight} object-cover rounded-lg border border-border`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              disabled={disabled}
              className="absolute top-2 right-2 h-6 w-6 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
              ${isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className={`text-sm mb-2 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`}>
              {placeholder.title}
            </p>
            {placeholder.subtitle && (
              <p className="text-xs text-muted-foreground">
                {placeholder.subtitle}
              </p>
            )}
          </div>
        )}
        
        <Input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          disabled={disabled}
          {...(register ? register(id.replace(/-/g, ''), {
            required: required ? `${label || 'Image'} is required` : false,
          }) : {})}
        />
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}
