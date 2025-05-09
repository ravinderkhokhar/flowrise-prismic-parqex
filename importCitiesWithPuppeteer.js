import "dotenv/config";
import * as prismic from "@prismicio/client";
import { repositoryName } from "./slicemachine.config.json";
import { readFile } from "fs/promises";

const writeClient = prismic.createWriteClient(repositoryName, {
  writeToken: process.env.PRISMIC_WRITE_TOKEN,
});

const migration = prismic.createMigration();

// Read the city data from cities.json
const raw = await readFile("./cities.json", "utf-8");
const cities = JSON.parse(raw);

// Loop over the cities and define migrations
for (const city of cities) {
  migration.createDocument({
    model: "city_page", // must match the API ID of your custom type
    uid: city.uid,
    lang: city.lang || "en-us",
    data: {
      breadcrumb_title: city.data.breadcrumb_title,
      title: city.data.title,
      page_title: city.data.page_title,
      description: city.data.description,
      hero_image: city.data.hero_image,
      slices: city.data.slices,
    },
  });
}

// Execute the migration
await writeClient.migrate(migration, {
  reporter: (event) => console.log(event),
});
