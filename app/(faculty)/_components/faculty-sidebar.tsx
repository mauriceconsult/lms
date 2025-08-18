"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { MessageSquare } from "lucide-react"; // Use MessageSquare instead of BulletinBoard
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Noticeboard {
  id: string;
  title: string;
}

interface ApiResponse {
  success: boolean;
  data?: Noticeboard[];
  message?: string;
}

const FacultySidebar = () => {
  const [noticeboards, setNoticeboards] = useState<Noticeboard[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn } = useUser();
  const params = useParams<{ facultyId: string }>();

  useEffect(() => {
    if (!isSignedIn || !params.facultyId) return;

    const fetchNoticeboards = async () => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
          }/api/faculties/${params.facultyId}/noticeboards`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result: ApiResponse = await response.json();
        if (result.success && result.data) {
          setNoticeboards(result.data);
        } else {
          throw new Error(result.message || "Failed to load noticeboards");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unexpected error occurred";
        console.error(
          `[${new Date().toISOString()} FacultySidebar] Error fetching noticeboards:`,
          error
        );
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeboards();
  }, [isSignedIn, params.facultyId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full p-4">
      <h2 className="text-lg font-medium mb-4">Published Noticeboards</h2>
      {noticeboards.length === 0 ? (
        <p className="text-sm text-slate-500 italic">
          No noticeboards available
        </p>
      ) : (
        noticeboards.map((noticeboard) => (
          <Link
            key={noticeboard.id}
            href={`/faculties/${params.facultyId}/noticeboards/${noticeboard.id}`}
            className="flex items-center gap-x-2 text-sm text-blue-600 hover:underline py-2"
          >
            <MessageSquare className="w-5 h-5" />
            <span>{noticeboard.title}</span>
          </Link>
        ))
      )}
    </div>
  );
};

export default FacultySidebar;
