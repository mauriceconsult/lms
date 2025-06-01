"use client";

import { Faculty } from "@prisma/client";
import { FacultyItem } from "./faculty-item";


interface FacultiesProps {
    items: Faculty[];
}
export const Faculties = ({
items,
}: FacultiesProps) => {
    return (
      <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
        {items.map((item) => (
          <FacultyItem
            key={item.id}
            label={item.title}            
            value={item.id}
          />
        ))}
      </div>
    );
}