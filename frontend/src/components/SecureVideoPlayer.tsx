'use client';

import React, { useEffect, useRef } from 'react';

export function SecureVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('contextmenu', handleContextMenu);
    }
    
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('contextmenu', handleContextMenu);
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video shadow-2xl border border-gray-800">
      <video
        ref={videoRef}
        src={src}
        controls
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        className="w-full h-full"
      >
        Browser Anda tidak mendukung video HTML5.
      </video>
    </div>
  );
}
