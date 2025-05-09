import { FC } from "react";
import { Content } from "@prismicio/client";
import { JSXMapSerializer, PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { PrismicNextLink } from "@prismicio/next";

const components: JSXMapSerializer = {
  heading2:({children})=>(
    <Heading as="h2" size="md" className="font-semibold text-left mb-4 pt-4">{children}</Heading>
  ),
  heading3:({children})=>(
    <Heading as="h3" size="sm" className="text-center mb-3 font-medium sm:text-left text-center">{children}</Heading>
  ),
  paragraph:({children})=>(
    <p className="text-left font-medium font-body font-normal text-[1rem] leading-[1.5] pb-[1rem]">{children}</p>
  ),
}

/**
 * Props for `PopularSection`.
 */
export type PopularSectionProps =
  SliceComponentProps<Content.PopularSectionSlice>;

/**
 * Component for "PopularSection" Slices.
 */
const PopularSection: FC<PopularSectionProps & { className?: string }> = ({ slice, className }) => {
  return (
    <Bounded  className={`bg-[#f6f7f9] ${className || "lg:py-2 lg:pt-8 lg:pb-0"}`}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
       <div className="max-w-3xl mx-auto">
          <PrismicRichText components={components} field={slice.primary.popular_heading} />
          <ul className="flex flex-wrap gap-3 sm:gap-3 md:gap-3 lg:gap-3 justify-center sm:justify-start">
          {slice.primary.items.map(({ link, label }, idx) => (
            <li key={idx}>
              <PrismicNextLink
                field={link}
                className="inline-block px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100 transition"
              >
                {label}
              </PrismicNextLink>
            </li>
          ))}
        </ul>
      </div>
    </Bounded>
  );
};

export default PopularSection;
