// "use client";

// import { useAuth, UserButton } from "@clerk/nextjs";
// import { usePathname } from "next/navigation";
// import { Button } from "./ui/button";
// import { LogOut } from "lucide-react";
// import Link from "next/link";
// import { SearchInput } from "./search-input";
// import { isTeacher } from "@/lib/teacher";

// const NavbarRoutes = () => {
//   const { userId } = useAuth();
//   const pathname = usePathname();

//   const isTeacherPage = pathname?.startsWith("/teacher");
//   const isPlayerPage = pathname?.includes("/courses");
//   const isSearchPage = pathname === "/search";

//   return (
//     <>
//       {isSearchPage && (
//         <div className="hidden md:block">
//           <SearchInput />
//         </div>
//       )}
//       <div className="flex gap-x-2 ml-auto">
//         {isTeacherPage || isPlayerPage ? (
//           <Link href={"/"}>
//             <Button size={"sm"} variant={"ghost"}>
//               <LogOut className="h-4 w-4 mr-2" />
//               Exit
//             </Button>
//           </Link>
//         ) : isTeacher(userId) ? (
//           <Link href="/teacher/courses">
//             <Button size={"sm"} variant={"ghost"}>
//               Teacher Mode
//             </Button>
//           </Link>
//         ) : null}
//         <UserButton afterSignOutUrl="/" />
//       </div>
//     </>
//   );
// };

// export default NavbarRoutes;

"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";

const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  // Here, set up searchParams to pass to SearchInput
  const searchParams = {
    categoryId: "", // Add logic to set categoryId as required
    title: "", // Add logic to set title as required
  };

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput searchParams={searchParams} />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isPlayerPage ? (
          <Link href={"/"}>
            <Button size={"sm"} variant={"ghost"}>
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button size={"sm"} variant={"ghost"}>
              Teacher Mode
            </Button>
          </Link>
        ) : null}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export default NavbarRoutes;
