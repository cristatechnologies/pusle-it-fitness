// components/PageNotFound.tsx
import { Search } from "lucide-react";

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Page Not Found",
//   description: "The page you are looking for does not exist.",
// };

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="relative">
        <Search className="w-20 h-20 text-gray-400" strokeWidth={1.5} />
        <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          0
        </span>
      </div>

      <h2 className="mt-6 text-xl font-semibold text-gray-800">
        Oops! That Page Can’t Be Found
      </h2>

      <p className="mt-2 text-gray-600 max-w-md">
        The page you are trying to reach is not available. Maybe try a search?
      </p>

      <form className="mt-6 flex items-stretch border border-gray-300 rounded overflow-hidden">
        <input
          type="text"
          placeholder="Search ..."
          className="px-4 py-2 w-64 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 flex items-center justify-center hover:bg-gray-800 transition"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default PageNotFound;
