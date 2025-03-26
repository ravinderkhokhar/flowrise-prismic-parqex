import { createClient } from "@/prismicio";
import { PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
export const Footer = async () => {
  const client = createClient();
  const settings = await client.getSingle("settings")
  return (
    <footer>
        <Link href="/">©{new Date().getFullYear()} {settings.data.site_title}</Link>
        <nav>
            <ul>
                {settings.data.navigation.map(({link,label})=>(
                    <li key={label}>
                        <PrismicNextLink field={link}>{label}</PrismicNextLink>
                    </li>
                ))}
            </ul>
        </nav>
    </footer>
  )
}
