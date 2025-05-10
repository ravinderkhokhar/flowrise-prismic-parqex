'use server';
import { JSXMapSerializer, SliceZone, PrismicRichText } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { components as sliceComponents } from '@/slices';
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Breadcrumb } from '@/components/Breadcrumb';
import Image from "next/image";
import type { SliceComponentProps } from '@prismicio/react';
import type { PopularSectionSlice } from "@/slices/PopularSection";

type Props = {
  params: {
    state: string;
    city: string;
  };
};

const components: JSXMapSerializer = {
  heading1:({children})=>(
    <Heading as="h1" className="text-[2rem] font-semibold  md:mb-8 mb-4 mt-12 first:mt-0 last:mb-0">{children}</Heading>
  ),
  heading2: ({ children }) => (
    <Heading as="h2" size="md" className="text-center mb-12">{children}</Heading>
  ),
  heading3: ({ children }) => (
    <Heading as="h3" size="sm" className="text-center mb-3 font-medium sm:text-left text-center">{children}</Heading>
  ),
  paragraph: ({ children }) => (
    <p className="text-base font-medium font-body text-slate-600 sm:text-left text-center">{children}</p>
  ),
};
//export default async function CityPage( props: { params: { state: string; city: string } }) {
  //const params = await props.params;
export default async function CityPage(props: Props) {
  const params = await props.params;
  const { city: citySlug } = params; // rename the slug
  const client = createClient();
  const city = await client.getByUID('city_page', citySlug).catch(() => notFound());
  if (!city) return notFound();

  return (
    <>
      <Bounded>
        <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12 mx-auto sm:place-items-start place-items-center">
          <div>
            <Breadcrumb cityName={city.data.breadcrumb_title || ''} />
            <PrismicRichText components={components} field={city.data.page_title || []} />
            <PrismicRichText components={components} field={city.data.description || []} />
          </div>
          <div>
            {city.data.hero_image?.url && (
              // <img src={city.data.hero_image.url} alt="" className="w-full rounded-3xl shadow-md" />
              <Image
                src={city.data.hero_image.url}
                alt={city.data.hero_image.alt || ""}
                width={800}
                height={400}
                className="rounded-xl shadow"
              />
            )}
          </div>
        </div>
      </Bounded>

      {city.data.slices.map((slice, index) => {
        const popularSlices = city.data.slices
          .map((s, i) => ({ slice: s, index: i }))
          .filter(({ slice }) => slice.slice_type === "popular_section");

        const firstPopularIndex = popularSlices[0]?.index;
        const lastPopularIndex = popularSlices.at(-1)?.index;

        if (slice.slice_type === "popular_section") {
          //const PopularSection = sliceComponents[slice.slice_type] as React.FC<any>;
          //const PopularSection = sliceComponents[slice.slice_type] as React.FC<SliceComponentProps<PopularSectionSlice>>;
          const PopularSection = sliceComponents[slice.slice_type] as React.FC<SliceComponentProps<PopularSectionSlice> & { className?: string }>;
          const isFirst = index === firstPopularIndex;
          const isLast = index === lastPopularIndex;
          const className = `${isFirst ? "lg:py-0 lg:pt-5 lg:pb-0" : ""} ${isLast ? "lg:py-0 lg:pt-8 lg:pb-16" : ""}`.trim();

          return (
            <PopularSection
              key={index}
              slice={slice}
              slices={city.data.slices}
              index={index}
              context={undefined}
              className={className}
            />
          );
        }

        return (
          <SliceZone
            key={index}
            slices={[slice]}
            components={sliceComponents}
          />
        );
      })}
    </>
  );
}

export async function generateMetadata(props: { params: { city: string } }): Promise<Metadata> {
  const params = await props.params;
  const { city } = params;

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

export async function generateStaticParams() {
  const client = createClient();
  const cities = await client.getAllByType('city_page');

  return cities.map((doc) => ({
    state: doc.data.state_slug,
    city: doc.uid
  }));
}