import type { Metadata } from 'next';
import { Nunito,Nunito_Sans } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { createClient,repositoryName } from "@/prismicio";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PrismicPreview } from '@prismicio/next';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const settings = await client.getSingle("settings")
 
  return {
    title: settings.data.site_title || "Flowrise fallback",
    description:settings.data.meta_description || "Flowrise Description",
    openGraph: {
      images: [settings.data.og_image.url || ""],
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={clsx(nunito.variable, nunitoSans.variable)}>
      <body className="relative">
        <Header/>
        {children}
        <Footer/>
        {/* <div className="fixed bg-gradient-to-tr from-emerald-50 to-cyan-50 z-[-1] inset-0 opacity-50"/> */}
        <PrismicPreview repositoryName={repositoryName}/>
      </body>
    </html>
  );
}
