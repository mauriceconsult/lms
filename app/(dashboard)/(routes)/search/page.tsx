"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LayoutDashboard, ListCheck } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

interface Faculty {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isPublished: boolean;
}

interface School {
  id: string;
  name: string;
  faculties: Faculty[];
}

interface ApiResponse {
  success: boolean;
  data?: School[];
  message?: string;
}

const SearchPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      console.error(
        `[${new Date().toISOString()} SearchPage] User not signed in`
      );
      router.push("/sign-in");
      return;
    }

    const fetchSchools = async () => {
      try {
        console.log(
          `[${new Date().toISOString()} SearchPage] Fetching from: /api/schools, User ID:`,
          user?.id
        );
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/schools`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        console.log(
          `[${new Date().toISOString()} SearchPage] Response status:`,
          response.status,
          response.statusText
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }
        const result: ApiResponse = await response.json();
        console.log(
          `[${new Date().toISOString()} SearchPage] Response data:`,
          result
        );
        if (result.success && result.data) {
          setSchools(result.data);
        } else {
          throw new Error(result.message || "Failed to load schools");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unexpected error occurred";
        console.error(
          `[${new Date().toISOString()} SearchPage] Error fetching schools:`,
          error
        );
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [isSignedIn, router, user]);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-medium">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-medium">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-medium">No Schools Found</h2>
        <p>No schools are available. Please create a school first.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-x-2 mb-6">
        <IconBadge icon={LayoutDashboard} />
        <h1 className="text-2xl font-medium">Schools & Faculties</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <Card key={school.id} className="border bg-slate-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <IconBadge icon={ListCheck} />
                <span>{school.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Faculties</h3>
                {school.faculties.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">
                    No faculties available
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {school.faculties.map((faculty) => (
                      <li key={faculty.id}>
                        <Link
                          href={`/faculties/${faculty.id}`}
                          className="block hover:bg-slate-100 rounded-md transition p-2"
                        >
                          <div className="flex items-center gap-x-4">
                            {faculty.imageUrl ? (
                              <Image
                                src={faculty.imageUrl}
                                alt={faculty.title}
                                width={80}
                                height={80}
                                className="rounded-md object-cover"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-slate-200 rounded-md flex items-center justify-center">
                                <span className="text-sm text-slate-500">
                                  No Image
                                </span>
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  {faculty.title}
                                </span>
                                <Badge
                                  variant={
                                    faculty.isPublished
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {faculty.isPublished ? "Published" : "Draft"}
                                </Badge>
                              </div>
                              {faculty.description && (
                                <p className="text-sm text-slate-600 mt-1">
                                  {faculty.description.length > 100
                                    ? `${faculty.description.slice(0, 100)}...`
                                    : faculty.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;