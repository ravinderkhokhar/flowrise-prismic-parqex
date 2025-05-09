import "dotenv/config";
import * as prismic from "@prismicio/client";
import { repositoryName } from "./slicemachine.config.json";
import * as fsp from "fs/promises";
import { htmlAsRichText } from "@prismicio/migrate";

// Create a write client with a write token
const writeClient = prismic.createWriteClient(repositoryName, {
  writeToken: process.env.PRISMIC_WRITE_TOKEN!,
});

// Create a migration instance
const migration = prismic.createMigration();

// Load the cities.json file
const files = await fsp.readdir("./citiesrec");
await Promise.all(
    files.map(async (filename)=> {
        const raw =  await fsp.readFile(`./citiesrec/${filename}`, "utf-8");
        console.log(`filename = ${filename}`);
        const cities = JSON.parse(raw);
        for (const city of cities) {
            // Convert root-level description if HTML is present
            const convertedRootDescription =
            city.data.description?.[0]?.text
            ? htmlAsRichText(city.data.description[0].text).result
            : city.data.description;
            //console.log("convertedRootDescription",convertedRootDescription);
            const slices = city.data.slices.map((slice) => {
            //console.log("Slice fields:", slice); 

            if (slice.slice_type === "city_parking_locations_section") {
                try {
                return {
                    slice_type: slice.slice_type,
                    variation: slice.variation || "default", // ✅ Add this
                    id: slice.id,
                    slice_label: slice.slice_label,
                    items: slice.items,
                    primary: {
                        heading: slice.primary.heading,
                        description: htmlAsRichText(slice.primary.description[0].text).result,
                        rate_table_heading: slice.primary.rate_table_heading,
                        //rates_table: slice.primary.rates_table
                        // Uncomment if needed:
                        // performance_heading: slice.primary.performance_heading,
                        // performers_list: slice.primary.performers_list,
                    },
                };
                } catch (err) {
                console.warn(`Failed to process slice for ${city.uid}:`, err);
                }
            }
            return slice; // Return other slice types unmodified
        });
        // Convert hero image to Prismic Asset
        const { url, alt } = city.data.hero_image;
        const heroImageAsset = migration.createAsset(url, alt);

        // Create the document
        migration.createDocument(
            {
            type: "city_page", // Custom type ID
            uid: city.uid,
            lang: city.lang || "en-us",
            data: {
                breadcrumb_title: city.data.breadcrumb_title,
                title: city.data.title,
                page_title: city.data.page_title,
                description: convertedRootDescription,
                hero_image: heroImageAsset,
                slices,
            },
            },
            city.data.title
        );
        }
    })
)
//const cities = JSON.parse(raw);

// Loop through the cities and create documents
// for (const city of cities) {
//   // Convert root-level description if HTML is present
//   const convertedRootDescription =
//     city.data.description?.[0]?.text
//       ? htmlAsRichText(city.data.description[0].text).result
//       : city.data.description;
//     //console.log("convertedRootDescription",convertedRootDescription);
//   const slices = city.data.slices.map((slice) => {
//     //console.log("Slice fields:", slice); 

//     if (slice.slice_type === "city_parking_locations_section") {
//         try {
//           return {
//             slice_type: slice.slice_type,
//             variation: slice.variation || "default", // ✅ Add this
//             id: slice.id,
//             slice_label: slice.slice_label,
//             items: slice.items,
//             primary: {
//                 heading: slice.primary.heading,
//                 description: htmlAsRichText(slice.primary.description[0].text).result,
//                 rate_table_heading: slice.primary.rate_table_heading,
//                 //rates_table: slice.primary.rates_table
//                 // Uncomment if needed:
//                 // performance_heading: slice.primary.performance_heading,
//                 // performers_list: slice.primary.performers_list,
//             },
//           };
//         } catch (err) {
//           console.warn(`Failed to process slice for ${city.uid}:`, err);
//         }
//       }
//     return slice; // Return other slice types unmodified
//   });
//   // Convert hero image to Prismic Asset
//   const { url, alt } = city.data.hero_image;
//   const heroImageAsset = migration.createAsset(url, alt);

//   // Create the document
//   migration.createDocument(
//     {
//       type: "city_page", // Custom type ID
//       uid: city.uid,
//       lang: city.lang || "en-us",
//       data: {
//         breadcrumb_title: city.data.breadcrumb_title,
//         title: city.data.title,
//         page_title: city.data.page_title,
//         description: convertedRootDescription,
//         hero_image: heroImageAsset,
//         slices,
//       },
//     },
//     city.data.title
//   );
// }

// Execute the migration
await writeClient.migrate(migration, {
  reporter: (event) => console.log(event),
});
