import React, { useState, useRef, useCallback } from 'react';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: string;
  type: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  preview?: string;
}

interface FileDropZoneProps {
  onFilesSelected?: (files: File[]) => void;
  onUploadComplete?: (files: UploadedFile[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSize?: number; // en MB
  multiple?: boolean;
  className?: string;
}

export default function FileDropZone({
  onFilesSelected,
  onUploadComplete,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  maxFiles = 10,
  maxSize = 10,
  multiple = true,
  className = ''
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return PhotoIcon;
    }
    return DocumentIcon;
  };

  const isValidFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Vérifier la taille
    if (file.size > maxSize * 1024 * 1024) {
      return { valid: false, error: `Fichier trop volumineux (max ${maxSize}MB)` };
    }

    // Vérifier le type
    const isAccepted = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.match(type.replace('*', '.*'));
    });

    if (!isAccepted) {
      return { valid: false, error: 'Type de fichier non autorisé' };
    }

    return { valid: true };
  }, [maxSize, acceptedTypes]);

  const simulateUpload = async (file: UploadedFile): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, status: 'success', progress: 100 }
                : f
            )
          );
          resolve();
        } else {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, progress }
                : f
            )
          );
        }
      }, 200);
    });
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (fileArray.length === 0) return;

    // Vérifier le nombre maximum de fichiers
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      alert(`Vous ne pouvez télécharger que ${maxFiles} fichiers maximum`);
      return;
    }

    if (onFilesSelected) {
      onFilesSelected(fileArray);
    }

    const newFiles: UploadedFile[] = [];

    for (const file of fileArray) {
      const validation = isValidFile(file);
      
      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        status: validation.valid ? 'uploading' : 'error',
        progress: validation.valid ? 0 : 0
      };

      // Créer une preview pour les images
      if (file.type.startsWith('image/') && validation.valid) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(uploadedFile);
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simuler l'upload des fichiers valides
    for (const file of newFiles) {
      if (file.status === 'uploading') {
        await simulateUpload(file);
      }
    }

    // Notifier quand tous les uploads sont terminés
    const successFiles = newFiles.filter(f => f.status === 'success');
    if (onUploadComplete && successFiles.length > 0) {
      onUploadComplete(successFiles);
    }
  }, [uploadedFiles, maxFiles, onFilesSelected, onUploadComplete, isValidFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    processFiles(files);
  }, [processFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone de drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-ena-blue-500 bg-ena-blue-50 scale-105'
            : 'border-gray-300 hover:border-ena-blue-400 hover:bg-gray-50'
        }`}
      >
        <CloudArrowUpIcon className={`mx-auto h-12 w-12 mb-4 ${
          isDragOver ? 'text-ena-blue-500' : 'text-gray-400'
        }`} />
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {isDragOver ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
          </p>
          <p className="text-sm text-gray-600">
            ou <span className="text-ena-blue-600 font-medium">cliquez pour parcourir</span>
          </p>
          <p className="text-xs text-gray-500">
            {acceptedTypes.join(', ')} • Max {maxSize}MB • {maxFiles} fichiers max
          </p>
        </div>
      </div>

      {/* Input caché */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Liste des fichiers uploadés */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">
            Fichiers ({uploadedFiles.length})
          </h4>
          
          {uploadedFiles.map((file) => {
            const IconComponent = getFileIcon(file.type);
            
            return (
              <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {/* Preview ou icône */}
                <div className="flex-shrink-0">
                  {file.preview ? (
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <IconComponent className="h-10 w-10 text-gray-400" />
                  )}
                </div>

                {/* Informations du fichier */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                  
                  {/* Barre de progression */}
                  {file.status === 'uploading' && (
                    <div className="mt-1">
                      <div className="bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-ena-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Statut */}
                <div className="flex-shrink-0">
                  {file.status === 'success' && (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  )}
                  {file.status === 'uploading' && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ena-blue-500" />
                  )}
                </div>

                {/* Bouton supprimer */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
