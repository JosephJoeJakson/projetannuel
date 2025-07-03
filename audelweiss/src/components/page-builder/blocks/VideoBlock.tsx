'use client';

import { VideoBlock as VideoBlockType } from '@/types/page';

interface VideoBlockProps {
  block: VideoBlockType;
}

export default function VideoBlock({ block }: VideoBlockProps) {
  const { 
    title, 
    videoType, 
    videoUrl, 
    videoFile, 
    videoId, 
    caption, 
    videoSize = 'medium',
    videoAlign = 'center',
    autoplay = false,
    muted = true,
    loop = false,
    controls = true
  } = block;

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'w-full'
  };

  let alignClass = '';
  if (videoAlign === 'left') alignClass = 'mx-0 mr-auto';
  else if (videoAlign === 'right') alignClass = 'mx-0 ml-auto';
  else alignClass = 'mx-auto';

  const renderVideo = () => {
    if (videoType === 'youtube' && videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}`;
      
      return (
        <iframe
          src={embedUrl}
          title={title || 'Vidéo YouTube'}
          className="w-full aspect-video rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (videoType === 'vimeo' && videoId) {
      const embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}`;
      
      return (
        <iframe
          src={embedUrl}
          title={title || 'Vidéo Vimeo'}
          className="w-full aspect-video rounded-lg"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (videoType === 'local' && videoFile?.url) {
      return (
        <video
          src={videoFile.url}
          className="w-full aspect-video rounded-lg"
          controls={controls}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
        >
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      );
    }

    return (
      <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Vidéo non disponible</p>
      </div>
    );
  };

  return (
    <div style={{ textAlign: block.textAlign || 'center' }}>
      <div className="container mx-auto px-4 py-8">
        {title && (
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            {title}
          </h2>
        )}
        
        <div className={`${sizeClasses[videoSize]} ${alignClass}`}>
          {renderVideo()}
          
          {caption && (
            <p className="text-sm text-gray-600 mt-2 text-center italic">
              {caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 