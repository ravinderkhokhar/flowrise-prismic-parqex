'use client';
import { FC, useState } from "react";
import { Content, LinkField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import { asLink } from "@prismicio/helpers";

interface NavigationChild {
  link: LinkField;
  label: string;
}

export type NavigationItemProps = SliceComponentProps<Content.NavigationItemSlice>;

const NavigationItem: FC<NavigationItemProps> = ({ slice }) => {
  const children = slice.primary.children as unknown as NavigationChild[];
  const hasChildren = children?.length > 0;

  // Mobile submenu toggle
  const [open, setOpen] = useState(false);

  return (
    <li className="relative group">
      {/* Main nav link */}
      <Link
        href={asLink(slice.primary.link as LinkField) || "#"}
        className="px-4 py-2 inline-block text-black hover:text-blue-600"
        onClick={() => setOpen(!open)} // toggles submenu in mobile
      >
        {slice.primary.label}
      </Link>

      {/* Desktop submenu */}
      {hasChildren && (
        <ul className="absolute left-0 top-full hidden md:group-hover:block bg-white shadow-lg z-10 min-w-[180px]">
          {children.map((child, index) => (
            <li key={index}>
              <Link
                href={asLink(child.link) || "#"}
                className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap text-black"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Mobile submenu (toggle-based) */}
      {hasChildren && (
        <ul className={`md:hidden pl-4 mt-1 space-y-1 ${open ? "block" : "hidden"}`}>
          {children.map((child, index) => (
            <li key={index}>
              <Link
                href={asLink(child.link) || "#"}
                className="block py-1 text-black"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default NavigationItem;
