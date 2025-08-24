// app/(eduplat)/_components/course-noticeboard-search-input.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export const CourseNoticeboardSearchInput = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log(
      `[${new Date().toISOString()} CourseNoticeboardSearchInput] Searching: ${
        e.target.value
      }`
    );
  };

  return (
    <Input
      type="text"
      placeholder="Search course noticeboards..."
      value={searchTerm}
      onChange={handleSearch}
      className="w-full max-w-xs"
    />
  );
};
