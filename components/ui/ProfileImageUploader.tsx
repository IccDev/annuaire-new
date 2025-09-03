"use client";

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileImageUploaderProps {
  currentImageUrl?: string | null;
  userName?: string | null;
  onImageUpdate: (newImageUrl: string | null) => void;
}

const ProfileImageUploader = ({ 
  currentImageUrl, 
  userName, 
  onImageUpdate 
}: ProfileImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/users/profile-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      onImageUpdate(data.user.imageUrl);
      toast.success('Photo de profil mise à jour avec succès !');
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch('/api/users/profile-image', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      onImageUpdate(null);
      toast.success('Photo de profil supprimée avec succès !');
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
          <AvatarImage 
            src={currentImageUrl || undefined} 
            alt={userName || 'User'} 
            className="object-cover"
          />
          <AvatarFallback className="text-2xl bg-gray-200">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
             onClick={triggerFileInput}>
          <Camera className="w-8 h-8 text-white" />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex space-x-2">
        <Button
          onClick={triggerFileInput}
          disabled={isUploading}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-t-2 border-blue-600 rounded-full animate-spin"></div>
              <span>Upload...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>{currentImageUrl ? 'Changer' : 'Ajouter'}</span>
            </>
          )}
        </Button>

        {currentImageUrl && (
          <Button
            onClick={handleDeleteImage}
            disabled={isDeleting}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-t-2 border-red-600 rounded-full animate-spin"></div>
                <span>Suppression...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Supprimer</span>
              </>
            )}
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center">
        JPG, PNG ou GIF • Max 5MB
      </p>
    </div>
  );
};

export default ProfileImageUploader;
