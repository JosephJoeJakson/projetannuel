export interface PageBlock {
  id: number;
  __component: string;
  title?: string;
  content?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  margin?: string;
}

export interface TextBlock extends PageBlock {
  __component: 'page-blocks.text-block';
  content: string;
}

export interface ImageBlock extends PageBlock {
  __component: 'page-blocks.image-block';
  image: {
    id: number;
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
  };
  altText?: string;
  caption?: string;
  imageSize?: 'small' | 'medium' | 'large' | 'full';
  imageAlign?: 'left' | 'center' | 'right';
  lightbox?: boolean;
}

export interface VideoBlock extends PageBlock {
  __component: 'page-blocks.video-block';
  videoType: 'youtube' | 'vimeo' | 'local';
  videoUrl?: string;
  videoFile?: {
    id: number;
    url: string;
    name: string;
  };
  videoId?: string;
  caption?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  videoSize?: 'small' | 'medium' | 'large' | 'full';
  videoAlign?: 'left' | 'center' | 'right';
}

export interface DocumentBlock extends PageBlock {
  __component: 'page-blocks.document-block';
  document: {
    id: number;
    url: string;
    name: string;
    size: number;
    mime: string;
  };
  description?: string;
  buttonText?: string;
  buttonStyle?: 'primary' | 'secondary' | 'outline';
  showFileInfo?: boolean;
}

export interface HeroBlock extends PageBlock {
  __component: 'page-blocks.hero-block';
  title: string;
  subtitle?: string;
  backgroundImage?: {
    id: number;
    url: string;
    alternativeText?: string;
  };
  backgroundColor?: string;
  textColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  textAlign?: 'left' | 'center' | 'right';
  buttonText?: string;
  buttonUrl?: string;
  buttonStyle?: 'primary' | 'secondary' | 'outline';
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  height?: 'small' | 'medium' | 'large' | 'full';
}

export interface Column {
  id: number;
  title?: string;
  content?: string;
  image?: {
    id: number;
    url: string;
    alternativeText?: string;
  };
  imagePosition?: 'top' | 'bottom';
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  padding?: string;
}

export interface ColumnsBlock extends PageBlock {
  __component: 'page-blocks.columns-block';
  columns: Column[];
  columnsLayout?: '2-columns' | '3-columns' | '4-columns' | '1-2' | '2-1' | '1-1-2' | '2-1-1';
  gap?: string;
  responsive?: boolean;
}

export interface CTAButton {
  id: number;
  text: string;
  url: string;
  style?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  openInNewTab?: boolean;
  icon?: string;
}

export interface CTABlock extends PageBlock {
  __component: 'page-blocks.cta-block';
  title: string;
  description?: string;
  backgroundImage?: {
    id: number;
    url: string;
    alternativeText?: string;
  };
  backgroundColor?: string;
  textColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  textAlign?: 'left' | 'center' | 'right';
  buttons: CTAButton[];
}

export type AnyBlock = TextBlock | ImageBlock | VideoBlock | DocumentBlock | HeroBlock | ColumnsBlock | CTABlock;

export interface Page {
  id: number;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  blocks: AnyBlock[];
  featuredImage?: {
    id: number;
    url: string;
    alternativeText?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PageMetadata {
  title: string;
  description?: string;
  slug: string;
} 