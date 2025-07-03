export type CategoryImage = {
  id: number;
  url: string;
  alternativeText?: string;
  caption?: string;
  formats?: any;
};

export type Category = {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image?: { data: CategoryImage | null } | null;
};
