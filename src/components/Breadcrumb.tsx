import Link from "next/link";

export function Breadcrumb({ cityName }: { cityName: string }) {
  return (
    <nav className="text-sm text-slate-600 mb-4">
      <ol className="flex space-x-2">
        <li>
          <Link href="/cities" className="hover:underline text-blue-600">
            Cities
          </Link>
          <span className="mx-1">›</span>
        </li>
        <li className="font-medium text-slate-800">{cityName}</li>
      </ol>
    </nav>
  );
}
