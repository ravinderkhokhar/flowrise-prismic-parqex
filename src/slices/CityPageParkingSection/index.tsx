import { FC } from "react";
import { Content } from "@prismicio/client";
import { JSXMapSerializer, PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";

const components: JSXMapSerializer = {
  heading1:({children})=>(
    <Heading as="h1" className="text-[2rem] font-semibold  md:mb-8 mb-4 mt-12 first:mt-0 last:mb-0">{children}</Heading>
  ),
  heading2: ({ children }) => (
    <Heading as="h2" size="md" className="text-center mb-5">{children}</Heading>
  ),
  heading3: ({ children }) => (
    <Heading as="h3" size="sm" className="text-center mb-3 font-medium sm:text-left text-center">{children}</Heading>
  ),
  paragraph: ({ children }) => (
    <p className="text-base font-medium font-body text-slate-600 sm:text-left text-center">{children}</p>
  ),
};
/**
 * Props for `CityPageParkingSection`.
 */
export type CityPageParkingSectionProps =
  SliceComponentProps<Content.CityPageParkingSectionSlice>;

/**
 * Component for "CityPageParkingSection" Slices.
 */
const CityPageParkingSection: FC<CityPageParkingSectionProps> = ({ slice }) => {
  return (
    <Bounded className="bg-[#f6f7f9] lg:pb-[0] mt-[-50]" 
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
        {slice.primary.parking_section.map((item, key) => (
          <div className={`max-w-3xl mx-auto ${key === 0 ? "" : "mt-15"}`} key={key} >
              <PrismicRichText components={components} field={item.heading} />
              <PrismicRichText components={components} field={item.description} />
          </div>
        ))} 
    </Bounded>
  );
};

export default CityPageParkingSection;
