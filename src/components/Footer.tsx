import { createClient } from "@/prismicio";
import { PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
import Logos from "@/components/Logos";
import Bounded from "@/components/Bounded";
export const Footer = async () => {
  const client = createClient();
  const settings = await client.getSingle("settings")
  return (
    <Bounded as="footer">
        <div className="flex sm:flex-row flex-col justify-between items-center gap-6">
            <Link href="/"><Logos/></Link>
            <p className="text-sm">©{new Date().getFullYear()} {settings.data.site_title}</p>
            <nav>
                <ul className="flex">
                    {settings.data.navigation.map(({link,label})=>(
                        <li key={label}>
                            <PrismicNextLink field={link} className="p-3">{label}</PrismicNextLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    </Bounded>
  )
}
