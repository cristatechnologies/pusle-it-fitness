import Link from "next/link";

interface ShopHeaderProps {
  totalResults: number;
  breadcrumbs: { label: string; href: string }[];
}

export default function ShopHeader({
  totalResults,
  breadcrumbs,
}: ShopHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-4 mb-6">
      <div className="text-sm text-gray-500 mb-4 md:mb-0">
        SHOWING ALL {totalResults} RESULTS
      </div>

      <div className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center">
            <Link href={item.href} className="hover:text-gray-700 uppercase">
              {item.label}
            </Link>
            {index < breadcrumbs.length - 1 && (
              <span className="mx-2 text-gray-400">›</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center mt-4 md:mt-0">
        <div className="relative mr-2">
          <select className="appearance-none border border-gray-300 rounded px-4 py-2 pr-8 bg-white text-sm uppercase">
            <option>DEFAULT SORTING</option>
            <option>PRICE: LOW TO HIGH</option>
            <option>PRICE: HIGH TO LOW</option>
            <option>NEWEST FIRST</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <button className="bg-black text-white px-6 py-2 text-sm uppercase">
          FILTER
        </button>
      </div>
    </div>
  );
}
