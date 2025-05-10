import { createClient } from '@/prismicio';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { state: string; city: string } }): Promise<Metadata> {
  const { city } = params; // ✅ safe here since the whole function is async
  const client = createClient();
  const cityDoc = await client.getByUID("city_page", city).catch(() => notFound());

  return {
    title: cityDoc.data.meta_title || "Default Title",
    description: cityDoc.data.meta_description || "Default description",
    openGraph: {
      images: [{ url: cityDoc.data.meta_image?.url ?? "" }],
    },
  };
}

