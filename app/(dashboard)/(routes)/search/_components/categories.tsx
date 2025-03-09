"use client"; // Mark this as client-side component
import { Suspense } from "react"; // Import Suspense
import { Category } from "@prisma/client";
import CategoryItem from "./category-item"; // Import CategoryItem

interface CategoriesProps {
  items: Category[];
}

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      <Suspense fallback={<div>Loading categories...</div>}>
        {items.map((item) => (
          <CategoryItem key={item.id} label={item.name} value={item.id} />
        ))}
      </Suspense>
    </div>
  );
};

export default Categories;
