'use client';

import { Page, AnyBlock } from '@/types/page';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import VideoBlock from './blocks/VideoBlock';
import DocumentBlock from './blocks/DocumentBlock';
import HeroBlock from './blocks/HeroBlock';
import ColumnsBlock from './blocks/ColumnsBlock';
import CTABlock from './blocks/CTABlock';

interface PageBuilderProps {
  page: Page;
}

export default function PageBuilder({ page }: PageBuilderProps) {
  const { blocks } = page;

  const renderBlock = (block: AnyBlock, index: number) => {
    const blockStyle = {
      backgroundColor: block.backgroundColor,
      color: block.textColor,
      padding: block.padding,
      margin: block.margin,
    };

    // Utiliser une clé unique combinant l'ID et l'index
    const uniqueKey = `${block.id}-${index}`;

    switch (block.__component) {
      case 'page-blocks.text-block':
        return (
          <div key={uniqueKey} style={blockStyle}>
            <TextBlock block={block} />
          </div>
        );

      case 'page-blocks.image-block':
        return (
          <div key={uniqueKey} style={blockStyle}>
            <ImageBlock block={block} />
          </div>
        );

      case 'page-blocks.video-block':
        return (
          <div key={uniqueKey} style={blockStyle}>
            <VideoBlock block={block} />
          </div>
        );

      case 'page-blocks.document-block':
        return (
          <div key={uniqueKey} style={blockStyle}>
            <DocumentBlock block={block} />
          </div>
        );

      case 'page-blocks.hero-block':
        return (
          <div key={uniqueKey} style={blockStyle}>
            <HeroBlock block={block} />
          </div>
        );

      case 'page-blocks.columns-block':
        return (
          <div key={uniqueKey} style={blockStyle}>
            <ColumnsBlock block={block} />
          </div>
        );

      case 'page-blocks.cta-block':
        return (
          <div key={uniqueKey} style={blockStyle}>
            <CTABlock block={block} />
          </div>
        );

      default:
        console.warn(`Bloc non reconnu: ${block.__component}`);
        return null;
    }
  };

  return (
    <div className="page-builder">
      {blocks && blocks.length > 0 ? (
        blocks.map((block, index) => renderBlock(block, index))
      ) : (
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500">
            Aucun contenu disponible pour cette page.
          </p>
        </div>
      )}
    </div>
  );
} 