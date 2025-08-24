"use client";

import { Admin } from "@prisma/client";
import { AdminItem } from "./admin-item";


interface FacultiesProps {
    items: Admin[];
}
export const Faculties = ({
items,
}: FacultiesProps) => {
    return (
      <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
        {items.map((item) => (
          <AdminItem
            key={item.id}
            label={item.title}            
            value={item.id}
          />
        ))}
      </div>
    );
}