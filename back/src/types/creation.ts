export interface CreationCategory {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}

export interface PhotoCaption {
  id: number;
  photo: {
    data: {
      id: number;
      attributes: {
        name: string;
        alternativeText?: string;
        caption?: string;
        width: number;
        height: number;
        formats?: any;
        hash: string;
        ext: string;
        mime: string;
        size: number;
        url: string;
        previewUrl?: string;
        provider: string;
        provider_metadata?: any;
        createdAt: string;
        updatedAt: string;
      };
    };
  };
  caption?: string;
  displayOrder: number;
}

export interface Creation {
  id: number;
  attributes: {
    name: string;
    slug: string;
    shortDescription: string;
    realizationTime?: string;
    fullDescription: string;
    creationDate: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    mainImage: {
      data: {
        id: number;
        attributes: {
          name: string;
          alternativeText?: string;
          caption?: string;
          width: number;
          height: number;
          formats?: any;
          hash: string;
          ext: string;
          mime: string;
          size: number;
          url: string;
          previewUrl?: string;
          provider: string;
          provider_metadata?: any;
          createdAt: string;
          updatedAt: string;
        };
      };
    };
    photoGallery?: PhotoCaption[];
    creation_categories?: {
      data: CreationCategory[];
    };
  };
}

export interface CreationCategoryResponse {
  data: CreationCategory[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface CreationResponse {
  data: Creation[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
} 