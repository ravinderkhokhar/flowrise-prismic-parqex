import { createClient } from "@/prismicio"; // adjust this path as needed
import { notFound } from "next/navigation";
import { asImageSrc, Content } from "@prismicio/client";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Metadata } from "next";
import { JSXMapSerializer } from "@prismicio/react";
import Image from "next/image";

type Params = {
  city: string;
  listing: string;
};
const components: JSXMapSerializer = {
  heading2:({children})=>(
    <Heading as="h2" size="md" className="text-center mb-12">{children}</Heading>
  ),
  heading3:({children})=>(
    <Heading as="h3" size="sm" className="text-center mb-3 font-medium sm:text-left text-center">{children}</Heading>
  ),
  paragraph:({children})=>(
    <p className="text-base font-medium font-body text-slate-600 sm:text-left text-center">{children}</p>
  ),
}
export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const { city, listing } = await params;

  // Get the listing document by UID
  const listingDoc = await client.getByUID("listing", listing).catch(() => notFound());
 // const listingDoc = await client.getByUID<Content.ListingDocument>("listing", listing);
  //const page = await client.getByUID("page", uid).catch(() => notFound());

  // Extract city relationship field
  const cityRef = listingDoc.data.city;
  // Validate city field and fetch full city document
  if (!cityRef || cityRef.link_type !== "Document" || !cityRef.id) {
    return notFound();
  }

  const cityDoc = await client.getByID<Content.CityDocument>(cityRef.id);
  //console.log(cityDoc.data);
  // Ensure city slug in URL matches the city's actual UID
  if (cityDoc.uid !== city) {
    return notFound();
  }

  return (
    <>
      {/* <img src={listingDoc.data.banner.url || ""} alt={listingDoc.data.banner.alt || ""} /> */}
      <Image src={listingDoc.data.banner.url || ""} alt={listingDoc.data.banner.alt || ""}
  width={800} height={500} className="w-full rounded-3xl shadow-md" />
      <Bounded>
        <div>
          <h1>{listingDoc.data.title}</h1>
          <p>City: {(cityDoc.data as Content.CityDocumentData & { title: string }).title}</p>
          
          <iframe
            width="600"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${listingDoc.data.map.latitude},${listingDoc.data.map.longitude}&z=16&output=embed`}>
          </iframe>
        </div>
      </Bounded>
    </>
    
  );
}

// Generate static params for all listing-city combinations
export async function generateStaticParams() {
    const client = createClient();
    const listings = await client.getAllByType("listing");
  
    // return listings.map((listing) => ({
    //   city: listing.data.city.uid, // ✅ must extract the UID
    //   listing: listing.uid,
    // }));
    return listings
    .map((listing) => {
      const cityRef = listing.data.city;

      // Ensure it's a valid linked document with UID
      if (
        cityRef.link_type === "Document" &&
        typeof cityRef.uid === "string"
      ) {
        return {
          city: cityRef.uid,
          listing: listing.uid,
        };
      }

      // Skip listings without valid city ref
      return null;
    })
    .filter((item): item is { city: string; listing: string } => item !== null);
  }

  export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
      const { listing } = await params; // ✅ Await params
      const client = createClient();

      const listingDoc = await client
        .getByUID("listing", listing)
        .catch(() => notFound());

      return {
        title: listingDoc.data.meta_title,
        description: listingDoc.data.meta_description,
        openGraph: {
          images: listingDoc.data.meta_image?.url
            ? [{ url: asImageSrc(listingDoc.data.meta_image) }]
            : [],
        },
      };
  }