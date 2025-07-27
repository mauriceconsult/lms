"use client";

import { Faculty } from "@prisma/client";
import {
  FcEngineering,
  FcReadingEbook,
  FcLibrary,
  FcMoneyTransfer,
  FcBiotech,
  FcGoodDecision,
  FcSportsMode,
} from "react-icons/fc";
import { IconType } from "react-icons";
import { FacultyItem } from "./faculty-item";

interface FacultiesProps {
    items: Faculty[];
}
const iconMap: Record<Faculty["title"], IconType> = {
  "Engineering & Technology": FcEngineering,
  "Arts & Humanities": FcReadingEbook,
  "Social Sciences": FcLibrary,
  "Natural Sciences": FcBiotech,
  "Business & Management": FcMoneyTransfer,
  "Health Sciences": FcGoodDecision,
  "Sports & Fitness": FcSportsMode,
};
export const Faculties = ({
items,
}: FacultiesProps) => {
    return (
      <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
        {items.map((item) => (
          <FacultyItem
            key={item.id}
            label={item.title}
            icon={iconMap[item.title]}
            value={item.id}
          />
        ))}
      </div>
    );
}