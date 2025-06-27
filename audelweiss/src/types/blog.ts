export interface Article {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    description: string;
    content: RichTextBlock[];
    publishedDate: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    mainImage: Media;
    author: Author;
    article_category: ArticleCategory;
}

export interface RichTextBlock {
    type: string;
    children: RichTextChild[];
}

export interface RichTextChild {
    text: string;
    type: string;
    bold?: boolean;
    underline?: boolean;
}

export interface Media {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
        large?: ImageFormat;
        medium?: ImageFormat;
        small?: ImageFormat;
        thumbnail?: ImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface ImageFormat {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path: string | null;
    size: number;
    width: number;
    height: number;
    sizeInBytes: number;
}

export interface Author {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface ArticleCategory {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}
