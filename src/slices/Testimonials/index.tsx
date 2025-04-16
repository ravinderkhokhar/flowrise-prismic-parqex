import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { JSXMapSerializer, PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { createClient } from "@/prismicio";
import { PrismicNextImage } from "@prismicio/next";
const components: JSXMapSerializer = {
  heading2:({children})=>(
    <Heading as="h2" size="md" className="text-center mb-9 font-semi">{children}</Heading>
  ),
  paragraph:({children})=>(
    <p className="font-normal font-body text-slate-600">{children}</p>
  ),
}

/**
 * Props for `Testimonials`.
 */
export type TestimonialsProps = SliceComponentProps<Content.TestimonialsSlice>;

/**
 * Component for "Testimonials" Slices.
 */
const Testimonials: FC<TestimonialsProps> = async ({ slice }) => {
  
  const client = createClient();
  const testimonials = await Promise.all(
    slice.primary.testimonial.map((item) => {
      if(isFilled.contentRelationship(item.testimonial) && item.testimonial.uid){
        return client.getByUID("testimonial",item.testimonial.uid);
      }
    })
  )
  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <PrismicRichText field={slice.primary.heading}  components={components}/>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">
        {testimonials.map((item,index)=> item && (
          <div key={index} className="border bg-white shadow-lg rounde-lg px-8 md:px-10 py-10 md:py10 grid content-between">
            <div className="mb-8 text-xl">
              <PrismicRichText field={item.data.quote}  components={components}/>
            </div>
            <div className="flex items-center">
              <PrismicNextImage field={item.data.avatar} width={56} height={56} className="rounded-full mr-4" imgixParams={{ar:"1:1",fit:"crop"}}/>
              <div>
                <div className="text-xl text-base font-medium text-slate-700">
                  <PrismicRichText field={item.data.name}  components={components}/>
                </div>
                <div className="text-sm font-normal text-slate-600">
                  <PrismicRichText field={item.data.job_title}  components={components}/>
                </div>
              </div>
            </div>            
          </div>
        ))}
      </div>
    </Bounded>
  );
};

export default Testimonials;
