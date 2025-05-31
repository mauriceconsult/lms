"use client";

import { School } from "@prisma/client";
import { SchoolItem } from "./school-item";

interface SchoolsProps {
    items: School[];
}
export const Schools = ({
items,
}: SchoolsProps) => {
    return (
      <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
        {items.map((item) => (
          <SchoolItem
            key={item.id}
            label={item.name}            
            value={item.id}
          />
        ))}
      </div>
    );
}