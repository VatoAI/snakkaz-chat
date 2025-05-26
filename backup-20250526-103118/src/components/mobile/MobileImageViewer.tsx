import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, ZoomIn, ZoomOut, Maximize2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileImageViewerProps {
  src: string;
  alt?: string;
  onClose: () => void;
  onDownload?: () => void;
  isCarousel?: boolean;
  carouselIndex?: number;
  carouselTotal?: number;
  onPrev?: () => void;
  onNext?: () => void;
}

export const MobileImageViewer: React.FC<MobileImageViewerProps> = ({
  src,
  alt = 'Image',
  onClose,
  onDownload,
  isCarousel = false,
  carouselIndex = 0,
  carouselTotal = 0,
  onPrev,
  onNext
}) => {
  const isMobile = useIsMobile();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Reset position and scale when src changes (for carousel)
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [src]);
  
  // Zoom functionality
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 5));
  };
  
  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 }); // Reset position at min zoom
      }
      return newScale;
    });
  };
  
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // Gesture handlers
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // Double tap to zoom
  const handleDoubleTap = () => {
    if (scale > 1) {
      handleReset();
    } else {
      setScale(2.5);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-center items-center mobile-safe-padding"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 mobile-top-safe">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-white bg-black/30 rounded-full h-10 w-10"
        >
          <X size={20} />
          <span className="sr-only">Lukk</span>
        </Button>
        
        <div className="flex items-center">
          {onDownload && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDownload}
              className="text-white bg-black/30 rounded-full h-10 w-10 mr-2"
            >
              <Download size={20} />
              <span className="sr-only">Last ned</span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="text-white bg-black/30 rounded-full h-10 w-10 mr-2"
          >
            <ZoomIn size={20} />
            <span className="sr-only">Zoom inn</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="text-white bg-black/30 rounded-full h-10 w-10 mr-2"
          >
            <ZoomOut size={20} />
            <span className="sr-only">Zoom ut</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="text-white bg-black/30 rounded-full h-10 w-10"
          >
            <Maximize2 size={20} />
            <span className="sr-only">Tilbakestill</span>
          </Button>
        </div>
      </div>
      
      {/* Main image container */}
      <motion.div
        className="w-full h-full flex items-center justify-center"
        onPanStart={handleDragStart}
        onPanEnd={handleDragEnd}
        drag={scale > 1}
        dragConstraints={{
          left: -200 * (scale - 1),
          right: 200 * (scale - 1),
          top: -200 * (scale - 1),
          bottom: 200 * (scale - 1)
        }}
        onPan={(e, info) => {
          if (scale === 1 && info.offset.y > 100) {
            onClose();
          }
        }}
        onTap={() => {
          // Handle single tap here if needed
        }}
        onTapStart={() => {
          // Track tap start for detecting double taps
        }}
        onTapCancel={() => {
          // Handle tap cancel
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain"
          style={{
            scale,
            cursor: scale > 1 ? 'grab' : 'auto',
          }}
          drag={false} // Disable framer's drag on the image itself
          onClick={handleDoubleTap} // Use onClick for double tap as a simpler alternative
        />
      </motion.div>
      
      {/* Carousel controls */}
      {isCarousel && carouselTotal > 1 && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 mobile-bottom-safe">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrev}
            disabled={carouselIndex === 0}
            className={`text-white ${
              carouselIndex === 0 ? 'opacity-50' : 'bg-black/30'
            } rounded-full h-10 w-10`}
          >
            <ArrowLeft size={20} />
            <span className="sr-only">Forrige</span>
          </Button>
          
          <div className="text-white text-sm">
            {carouselIndex + 1} / {carouselTotal}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={carouselIndex === carouselTotal - 1}
            className={`text-white ${
              carouselIndex === carouselTotal - 1 ? 'opacity-50' : 'bg-black/30'
            } rounded-full h-10 w-10`}
          >
            <ArrowRight size={20} />
            <span className="sr-only">Neste</span>
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default MobileImageViewer;