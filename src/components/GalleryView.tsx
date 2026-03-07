'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, Upload, X, Share2, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Photo {
  id: string;
  data: string;
  timestamp: number;
  caption?: string;
}

// IndexedDB helper
const DB_NAME = 'rome-gallery';
const STORE_NAME = 'photos';

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

async function savePhoto(photo: Photo): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(photo);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function getPhotos(): Promise<Photo[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const photos = request.result as Photo[];
      photos.sort((a, b) => b.timestamp - a.timestamp);
      resolve(photos);
    };
  });
}

async function deletePhoto(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export function GalleryView() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Load photos on mount
  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const savedPhotos = await getPhotos();
      setPhotos(savedPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      setCameraStream(stream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const photo: Photo = {
      id: `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      data: canvas.toDataURL('image/jpeg', 0.8),
      timestamp: Date.now(),
    };

    savePhoto(photo).then(() => {
      setPhotos(prev => [photo, ...prev]);
      stopCamera();
    }).catch(console.error);
  };

  const switchCamera = async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newMode },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error switching camera:', error);
    }
  };

  // File upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result as string;
        const photo: Photo = {
          id: `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          data,
          timestamp: Date.now(),
        };
        
        try {
          await savePhoto(photo);
          setPhotos(prev => [photo, ...prev]);
        } catch (error) {
          console.error('Error saving photo:', error);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Share photo
  const sharePhoto = async (photo: Photo) => {
    if (!navigator.share) {
      alert('Sharing is not supported on this device.');
      return;
    }

    try {
      const response = await fetch(photo.data);
      const blob = await response.blob();
      const file = new File([blob], `rome-photo-${photo.timestamp}.jpg`, { type: 'image/jpeg' });
      
      await navigator.share({
        files: [file],
        title: 'Rome Trip Photo',
        text: 'Check out my Rome trip photo!',
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  };

  // Delete photo
  const handleDeletePhoto = async (photo: Photo) => {
    if (!confirm('Delete this photo?')) return;

    try {
      await deletePhoto(photo.id);
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  if (showCamera) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Camera Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-around">
          <button
            onClick={stopCamera}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center touch-target"
          >
            <X className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={takePhoto}
            className="w-20 h-20 rounded-full bg-pink-500 border-4 border-white flex items-center justify-center touch-target shadow-lg shadow-pink-500/50"
          >
            <Camera className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={switchCamera}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center touch-target"
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Actions */}
      <div className="flex items-center justify-between p-4 glass-card mb-4">
        <h2 className="text-lg font-semibold text-foreground">My Photos</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={startCamera}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors touch-target"
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">Camera</span>
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors cursor-pointer touch-target">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Upload</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-muted-foreground">Loading photos...</div>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 rounded-full bg-pink-500/20 flex items-center justify-center mb-4">
              <Camera className="w-10 h-10 text-pink-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No photos yet</h3>
            <p className="text-sm text-muted-foreground">
              Take photos of your Rome adventure to save them here!
            </p>
          </div>
        ) : (
          <div className="masonry-grid">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="masonry-item group relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.data}
                  alt="Rome trip photo"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                    <span className="text-xs text-white">
                      {new Date(photo.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto.data}
            alt="Rome trip photo"
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
          
          {/* Lightbox Controls */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                sharePhoto(selectedPhoto);
              }}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center touch-target"
            >
              <Share2 className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePhoto(selectedPhoto);
              }}
              className="w-12 h-12 rounded-full bg-red-500/80 backdrop-blur flex items-center justify-center touch-target"
            >
              <Trash2 className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center touch-target"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
