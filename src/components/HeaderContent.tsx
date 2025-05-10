'use client';

import { useState } from "react";
import Link from "next/link";
import Logos from "@/components/Logos";
import Bounded from "@/components/Bounded";
import { SliceZone } from "@prismicio/react";
import { components } from '@/slices'; // ✅ move here, safe in client
import { Content } from "@prismicio/client";
type HeaderContentProps = {
  settings: Content.SettingsDocument;
};
export default function HeaderContent({ settings }: HeaderContentProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Bounded as="header" className="py-4 md:py-6 lg:py-8">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Logos />
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <SliceZone slices={settings.data.slices} components={components} />
          </ul>
        </nav>
      </div>

      {isOpen && (
        <nav className="md:hidden mt-4">
          <ul className="flex flex-col space-y-2">
            <SliceZone slices={settings.data.slices} components={components} />
          </ul>
        </nav>
      )}
    </Bounded>
  );
}
