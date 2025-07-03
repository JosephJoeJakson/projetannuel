'use client';

import { ColumnsBlock as ColumnsBlockType, Column } from '@/types/page';
import Placeholder from '@/components/common/Placeholder';

interface ColumnsBlockProps {
  block: ColumnsBlockType;
}

export default function ColumnsBlock({ block }: ColumnsBlockProps) {
  const { 
    title, 
    columns, 
    columnsLayout = '2-columns',
    gap = '2rem',
    responsive = true 
  } = block;

  const layoutClasses = {
    '2-columns': 'grid-cols-1 md:grid-cols-2',
    '3-columns': 'grid-cols-1 md:grid-cols-3',
    '4-columns': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    '1-2': 'grid-cols-1 md:grid-cols-3',
    '2-1': 'grid-cols-1 md:grid-cols-3',
    '1-1-2': 'grid-cols-1 md:grid-cols-4',
    '2-1-1': 'grid-cols-1 md:grid-cols-4'
  };

  const columnSpanClasses = {
    '1-2': 'md:col-span-1 md:col-span-2',
    '2-1': 'md:col-span-2 md:col-span-1',
    '1-1-2': 'md:col-span-1 md:col-span-1 md:col-span-2',
    '2-1-1': 'md:col-span-2 md:col-span-1 md:col-span-1'
  };

  const renderColumn = (column: Column, index: number) => {
    const { title, content, image, imagePosition = 'top', textAlign = 'left', backgroundColor, padding } = column;

    const columnStyle = {
      backgroundColor,
      padding,
      textAlign: textAlign as 'left' | 'center' | 'right',
    };

    const spanClass = columnsLayout in columnSpanClasses ? columnSpanClasses[columnsLayout as keyof typeof columnSpanClasses] : '';

    return (
      <div 
        key={column.id} 
        className={`${spanClass}`}
        style={columnStyle}
      >
        <div className="h-full flex flex-col">
          {imagePosition === 'top' && image?.url && (
            <div className="mb-4">
              <img
                src={image.url}
                alt={image.alternativeText || title || 'Image'}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          <div className="flex-1">
            {title && (
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {title}
              </h3>
            )}
            
            {content && (
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
          
          {imagePosition === 'bottom' && image?.url && (
            <div className="mt-4">
              <img
                src={image.url}
                alt={image.alternativeText || title || 'Image'}
                className="w-full h-auto rounded-lg"
              />
            </div>
          )}
          
          {!image?.url && (
            <div className="mt-4">
              <Placeholder className="w-full h-32 rounded-lg" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          {title}
        </h2>
      )}
      
      <div 
        className={`grid gap-8 ${layoutClasses[columnsLayout]}`}
        style={{ gap }}
      >
        {columns.map((column, index) => renderColumn(column, index))}
      </div>
    </div>
  );
} 