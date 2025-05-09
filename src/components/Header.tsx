import { createClient } from "@/prismicio";
import HeaderContent from "@/components/HeaderContent";

export const Header = async () => {
  const client = createClient();
  const settings = await client.getSingle("settings");

  return <HeaderContent settings={settings} />;
};
