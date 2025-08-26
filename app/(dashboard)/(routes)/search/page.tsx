"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { LayoutDashboard, ListCheck } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { AdminCard } from "@/components/admin-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

interface Admin {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  school: { name: string };
}

interface School {
  id: string;
  name: string;
  admins: Admin[];
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
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
          }/api/schools`,
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
          throw new Error(
            `HTTP error! Status: ${response.status} ${response.statusText}`
          );
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
        <div className="flex items-center gap-x-2 mb-6">
          <IconBadge icon={LayoutDashboard} />
          <h1 className="text-2xl font-medium">Schools & Admins</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border bg-slate-50 animate-pulse">
              <CardHeader>
                <CardTitle className="flex items-center gap-x-2">
                  <div className="w-6 h-6 bg-slate-200 rounded-full" />
                  <div className="h-6 w-3/4 bg-slate-200 rounded" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 w-1/2 bg-slate-200 rounded" />
                <div className="space-y-2">
                  <div className="flex items-center gap-x-4">
                    <div className="w-20 h-20 bg-slate-200 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-slate-200 rounded" />
                      <div className="h-3 w-1/4 bg-slate-200 rounded" />
                      <div className="h-3 w-full bg-slate-200 rounded" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-x-2 mb-6">
          <IconBadge icon={LayoutDashboard} />
          <h1 className="text-2xl font-medium">Error</h1>
        </div>
        <Card className="border bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-x-2 mb-6">
          <IconBadge icon={LayoutDashboard} />
          <h1 className="text-2xl font-medium">No Schools Found</h1>
        </div>
        <Card className="border bg-slate-50">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500 italic">
              No schools are available. Please create a school first.
            </p>
            <Link href="/admin/create-admin/new">
              <Button className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create School
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-x-2 mb-6">
        <IconBadge icon={LayoutDashboard} />
        <h1 className="text-2xl font-medium">Schools & Admins</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <Card
            key={school.id}
            className="border bg-slate-50 hover:shadow-md transition"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <IconBadge icon={ListCheck} />
                <span>{school.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Admins</h3>
                {school.admins.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">
                    No admins available
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {school.admins.map((admin) => (
                      <AdminCard
                        key={admin.id}
                        id={admin.id}
                        title={admin.title}
                        imageUrl={admin.imageUrl || "/placeholder.jpg"}
                        description={admin.description || ""}
                        school={school.name}
                      />
                    ))}
                  </div>
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
