import { notFound } from 'next/navigation';
import { fetchPageBySlug, fetchPageMetadata } from '@/services/page';
import { Page } from '@/types/page';
import PageBuilder from '@/components/page-builder/PageBuilder';
import { parseColor } from '@/utils/color';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const metadata = await fetchPageMetadata(params.slug);
  
  if (!metadata) {
    return {
      title: 'Page non trouvée',
      description: 'La page demandée n\'existe pas.'
    };
  }

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const page = await fetchPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <PageBuilder page={page} />
    </div>
  );
} 