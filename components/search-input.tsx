// "use client";

// import { Search } from "lucide-react";
// import qs from "query-string";
// import { Input } from "@/components/ui/input";
// import { useEffect, useState } from "react";
// import { useDebounce } from "@/hooks/use-debounce";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";

// export const SearchInput = () => {
//   const [value, setValue] = useState("");
//   const debouncedValue = useDebounce(value);

//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   const currentCategoryId = searchParams.get("categoryId");

//   useEffect(() => {
//     const url = qs.stringifyUrl(
//       {
//         url: pathname,
//         query: {
//           categoryId: currentCategoryId,
//           title: debouncedValue,
//         },
//       },
//       { skipEmptyString: true, skipNull: true }
//     );

//     router.push(url);
//   }, [debouncedValue, currentCategoryId, router, pathname]);

//   return (
//     <div className="relative">
//       <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
//       <Input
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
//         placeholder="Search for a course"
//       />
//     </div>
//   );
// };

"use client";

import { Search } from "lucide-react";
import qs from "query-string";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter, usePathname } from "next/navigation";

interface SearchInputProps {
  searchParams: {
    categoryId?: string; // Make categoryId optional
    title?: string; // Make title optional
  };
}

export const SearchInput = ({ searchParams = {} }: SearchInputProps) => {
  const { categoryId = "", title = "" } = searchParams; // Destructure with default values

  const [value, setValue] = useState(title);
  const debouncedValue = useDebounce(value);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debouncedValue, categoryId, router, pathname]);

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course"
      />
    </div>
  );
};
