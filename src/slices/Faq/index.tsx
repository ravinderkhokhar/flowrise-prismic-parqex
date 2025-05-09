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
  list: ({ children }) => (
    <ul className="list-disc pl-6 space-y-2">{children}</ul>
  ),
  oList: ({ children }) => (
    <ol className="list-decimal pl-6 space-y-2">{children}</ol>
  ),
  listItem: ({ children }) => (
    <li className="text-base text-slate-700">{children}</li>
  ),
  oListItem: ({ children }) => (
    <li className="text-base text-slate-700">{children}</li>
  ),
  hyperlink: ({ node, children }) => (
    <a
      href={node.data.url}
      target={node.data.target}
      rel={node.data.target === "_blank" ? "noopener noreferrer" : undefined}
      className="text-blue-600 underline hover:text-blue-800"
    >
      {children}
    </a>
  ),
};
/**
 * Props for `Faq`.
 */
export type FaqProps = SliceComponentProps<Content.FaqSlice>;

/**
 * Component for "Faq" Slices.
 */
const Faq: FC<FaqProps> = ({ slice }) => {
  return (
    <Bounded className="bg-[#f6f7f9]"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="max-w-3xl mx-auto">
        <PrismicRichText components={components} field={slice.primary.heading} />
        {slice.primary.quesans.map((item, key) => (
          <div className={`max-w-3xl mx-auto ${key === 0 ? "" : "mt-10"}`} key={key} >
              <PrismicRichText components={components} field={item.question} />
              <PrismicRichText components={components} field={item.answer} />
          </div>
        ))}
      </div>
    </Bounded>
  );
};

export default Faq;
