'use client';

import { TextBlock as TextBlockType } from '@/types/page';

interface TextBlockProps {
  block: TextBlockType;
}

export default function TextBlock({ block }: TextBlockProps) {
  const { title, content, textAlign = 'left' } = block;

  const containerStyle = {
    textAlign: block.textAlign || 'left',
  };

  return (
    <div className="container mx-auto px-4 py-8" style={containerStyle}>
      {title && (
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          {title}
        </h2>
      )}
      
      {content && (
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
} 