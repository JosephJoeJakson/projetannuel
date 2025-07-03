'use client';

import { HeroBlock as HeroBlockType } from '@/types/page';
import Link from 'next/link';

interface HeroBlockProps {
  block: HeroBlockType;
}

export default function HeroBlock({ block }: HeroBlockProps) {
  const { 
    title, 
    subtitle, 
    backgroundImage, 
    backgroundColor = '#f8f9fa',
    textColor = '#1f2937',
    overlayColor = 'rgba(0, 0, 0, 0.3)',
    overlayOpacity = 0.3,
    textAlign = 'center',
    buttonText, 
    buttonUrl, 
    buttonStyle = 'primary',
    secondaryButtonText, 
    secondaryButtonUrl,
    height = 'medium'
  } = block;

  const heightClasses = {
    small: 'min-h-[300px]',
    medium: 'min-h-[500px]',
    large: 'min-h-[700px]',
    full: 'min-h-screen'
  };

  const buttonClasses = {
    primary: 'bg-[#E8A499] text-white hover:bg-opacity-90',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-gray-800'
  };

  const containerStyle = {
    backgroundColor: backgroundColor,
    color: textColor,
    textAlign: textAlign as 'left' | 'center' | 'right',
  };

  const overlayStyle = {
    backgroundColor: overlayColor,
    opacity: overlayOpacity,
  };

  return (
    <div 
      className={`relative flex items-center justify-center ${heightClasses[height]}`}
      style={containerStyle}
    >
      {backgroundImage?.url && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage.url})` }}
          />
          <div 
            className="absolute inset-0"
            style={overlayStyle}
          />
        </>
      )}
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {buttonText && buttonUrl && (
            <Link
              href={buttonUrl}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${buttonClasses[buttonStyle]}`}
            >
              {buttonText}
            </Link>
          )}
          
          {secondaryButtonText && secondaryButtonUrl && (
            <Link
              href={secondaryButtonUrl}
              className="px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white text-white hover:bg-white hover:text-gray-800 transition-colors"
            >
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 