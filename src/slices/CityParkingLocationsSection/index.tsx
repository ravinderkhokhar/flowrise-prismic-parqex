import { FC } from "react";
import { Content } from "@prismicio/client";
import { JSXMapSerializer, PrismicRichText, SliceComponentProps } from "@prismicio/react";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { asText } from "@prismicio/helpers";
// function isStructuredTable(
//   table: unknown
// ): table is { rows: { columns: { text?: string }[] }[] } {
//   return (
//     typeof table === "object" &&
//     table !== null &&
//     "rows" in table &&
//     Array.isArray((table as any).rows) &&
//     (table as any).rows.every(
//       (row: any) =>
//         row &&
//         Array.isArray(row.columns) &&
//         row.columns.every((cell: any) => typeof cell === "object" && "text" in cell)
//     )
//   );
// }

const components: JSXMapSerializer = {
  heading2:({children})=>(
    <Heading as="h2" size="md" className="font-semibold text-left  mb-2 mt-10">{children}</Heading>
  ),
  heading3:({children})=>(
    <Heading as="h3" size="sm" className="text-center mb-3 font-medium sm:text-left text-center">{children}</Heading>
  ),
  paragraph:({children})=>(
    <p className="text-left font-medium font-body font-normal text-[1rem] leading-[1.5] pb-[1rem]">{children}</p>
  ),
}

/**
 * Props for `CityParkingLocationsSection`.
 */
export type CityParkingLocationsSectionProps =
  SliceComponentProps<Content.CityParkingLocationsSectionSlice>;

/**
 * Component for "CityParkingLocationsSection" Slices.
 */
const CityParkingLocationsSection: FC<CityParkingLocationsSectionProps> = ({
  slice,
}) => {
  const table = slice.primary.rates_table;
  const hasRows =
  table && // ensures table is not null or undefined
  typeof table === "object" && // ensures it's actually an object
  "body" in table && // ensures the 'body' key exists in the object
  table.body?.rows && // checks that body has 'rows' (non-nullish)
  Array.isArray(table.body.rows) && // confirms rows is actually an array
  table.body.rows.length > 0; // checks the array is not empty

  return (
    <Bounded  className="bg-[#f6f7f9] lg:pb-[10]" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="max-w-3xl bg-red mx-auto">
          <PrismicRichText components={components} field={slice.primary.heading} />
          <PrismicRichText components={components} field={slice.primary.description} />
      </div>
          <PrismicRichText components={components} field={slice.primary.rate_table_heading} />
          {/* DEBUG: View the raw structure of the rates_table */}
        {/* <pre className="bg-white text-black p-4 overflow-auto text-sm">
          {JSON.stringify(table, null, 2)}
        </pre> */}
        {hasRows && (
          <div className="overflow-x-auto rounded-2xl shadow-lg mx-auto mt-6">
            <table className="min-w-full text-sm text-left text-slate-700 border-collapse">
              <thead className="bg-white border-[#cbd4de]">
                <tr>
                  {table.body.rows[0].cells.map((cell, idx) => (
                    <th key={idx} className="px-4 py-3 font-bold text-[1rem] border-b border-[#cbd4de]">
                      {asText(cell.content)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.body.rows.slice(1).map((row, rowIndex) => (
                  // <tr key={rowIndex} className="odd:bg-white font-semibold even:bg-slate-50">
                  <tr key={rowIndex} className="bg-white border-b font-semibold border-[#cbd4de]">
                     {row.cells.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`px-4 py-3 border-[#cbd4de] ${
                          cellIndex === 0 ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {asText(cell.content)}
                      </td>
                    ))}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="max-w-3xl bg-red mx-auto">
          <PrismicRichText components={components} field={slice.primary.performance_heading} />
          {/* {<pre>{JSON.stringify(slice.primary.performers_list, null, 2)}</pre>} */}
          <ul className="divide-y divide-slate-200 bg-slate-50 rounded-lg">
            {slice.primary.performers_list?.map((item, index) => {
              const node = item.performers_name?.[0];

              if (node?.type === "paragraph") {
                const text = node.text || "";
                const hyperlink = node.spans?.find((span) => span.type === "hyperlink");
          
                if (hyperlink) {
                  const url = hyperlink.data?.url || "#";
                  const isWebLink = hyperlink.data?.link_type === "Web";
                  const target = isWebLink ? (hyperlink.data as { target?: string }).target || "_self" : "_self";
          
                  return (
                    <li key={index} className="px-4 py-3 text-slate-800 font-medium">
                      <a
                        href={url}
                        target={target}
                        rel={target === "_blank" ? "noopener noreferrer" : undefined}
                        className="text-blue-600 hover:underline"
                      >
                        {text}
                      </a>
                    </li>
                  );
                } else {
                  // No hyperlink span; just render plain text
                  return (
                    <li key={index} className="px-4 py-3 text-slate-800 font-medium">
                      {text}
                    </li>
                  );
                }
              }
          
              return null;
            })}
          </ul>
        </div>
      
    </Bounded>
  );
};

export default CityParkingLocationsSection;
