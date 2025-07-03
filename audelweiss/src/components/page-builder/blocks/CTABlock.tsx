'use client';

import { CTABlock as CTABlockType } from '@/types/page';
import Link from 'next/link';

interface CTABlockProps {
  block: CTABlockType;
}

export default function CTABlock({ block }: CTABlockProps) {
  const { 
    title, 
    description, 
    backgroundImage, 
    backgroundColor = '#f8f9fa',
    textColor = '#1f2937',
    overlayColor = 'rgba(0, 0, 0, 0.3)',
    overlayOpacity = 0.3,
    textAlign = 'center',
    buttons 
  } = block;

  const buttonClasses = {
    primary: 'bg-[#E8A499] text-white hover:bg-opacity-90',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-gray-800',
    ghost: 'text-white hover:bg-white hover:text-gray-800'
  };

  const buttonSizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
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
      className="relative py-16 px-4"
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
      
      <div className="relative z-10 container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {title}
        </h2>
        
        {description && (
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        
        {buttons && buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {buttons.map((button) => (
              <Link
                key={button.id}
                href={button.url}
                target={button.openInNewTab ? '_blank' : '_self'}
                rel={button.openInNewTab ? 'noopener noreferrer' : ''}
                className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${buttonClasses[button.style || 'primary']} ${buttonSizeClasses[button.size || 'medium']}`}
              >
                {button.icon && <span className="mr-2">{button.icon}</span>}
                {button.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 