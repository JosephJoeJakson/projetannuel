'use client';

import { ImageBlock as ImageBlockType } from '@/types/page';
import Placeholder from '@/components/common/Placeholder';
import { parseColor } from '@/utils/color';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ImageBlockProps {
  block: ImageBlockType;
}

export default function ImageBlock({ block }: ImageBlockProps) {
  const {
    title,
    image,
    altText,
    caption,
    imageSize = 'medium',
    imageAlign = 'center',
    lightbox = false,
    layout = 'image-only',
    textContent,
    backgroundColor,
    margin,
    padding
  } = block;

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'w-full'
  };

  let alignClass = '';
  if (imageAlign === 'left') alignClass = 'mx-0 mr-auto';
  else if (imageAlign === 'right') alignClass = 'mx-0 ml-auto';
  else alignClass = 'mx-auto';

  const handleImageClick = () => {
    if (lightbox && image?.url) {
      window.open(imageUrl, '_blank');
    }
  };

  const imageUrl = image?.url
    ? (image.url.startsWith('http') ? image.url : `${API_URL}${image.url}`)
    : null;

  const blockStyle = {
    backgroundColor: parseColor(backgroundColor),
    margin,
    padding,
  };

  if (layout === 'image-left' || layout === 'image-right') {
    return (
      <div className="container mx-auto px-4 py-8">
        {title && (
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            {title}
          </h2>
        )}
        <div className={`flex flex-col md:flex-row ${layout === 'image-right' ? 'md:flex-row-reverse' : ''} items-center gap-8`}>
          <div className="flex-1">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={altText || image?.alternativeText || title || 'Image'}
                className="w-full h-auto rounded-lg shadow-lg"
                onClick={lightbox ? () => window.open(imageUrl, '_blank') : undefined}
                style={{ cursor: lightbox ? 'pointer' : undefined }}
              />
            ) : (
              <Placeholder className="w-full h-64 rounded-lg" />
            )}
            {caption && (
              <p className="text-sm text-gray-600 mt-2 text-center italic">
                {caption}
              </p>
            )}
          </div>
          <div className="flex-1">
            {textContent && (
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: textContent }} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          {title}
        </h2>
      )}
      <div className={`max-w-2xl ${alignClass}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={altText || image?.alternativeText || title || 'Image'}
            className="w-full h-auto rounded-lg shadow-lg"
            onClick={lightbox ? () => window.open(imageUrl, '_blank') : undefined}
            style={{ cursor: lightbox ? 'pointer' : undefined }}
          />
        ) : (
          <Placeholder className="w-full h-64 rounded-lg" />
        )}
        {caption && (
          <p className="text-sm text-gray-600 mt-2 text-center italic">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
} 