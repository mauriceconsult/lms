"use client";

import { Payroll } from "@prisma/client";
import { PayrollItem } from "./payroll-item";


interface PayrollsProps {
    items: Payroll[];
}
export const Payrolls = ({
items,
}: PayrollsProps) => {
    return (
      <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
        {items.map((item) => (
          <PayrollItem
            key={item.id}
            label={item.title}            
            value={item.id}
          />
        ))}
      </div>
    );
}