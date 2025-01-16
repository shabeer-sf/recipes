"use client";

import React, { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import Link from "next/link";
import { deleteRecipeById, getRecipes } from "@/actions/recipe";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const VideoListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [videos, setVideos] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const itemsPerPage = 15;

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await getRecipes({
        search: searchQuery,
        page: currentPage,
        limit: itemsPerPage,
        sort: sortBy,
      });
      console.log(response, response.recipes);
      setVideos(response.recipes);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [searchQuery, currentPage, sortBy]);

  const toggleDescription = (id) => {
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.id === id
          ? { ...video, expanded: !video.expanded }
          : { ...video, expanded: false }
      )
    );
  };

  const deletDataById = async (id) => {
    // console.log("",id)

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (!isConfirmed) {
      return; // Exit the function if the user cancels
    }

    const deleteData = await deleteRecipeById(id);
    if (deleteData.success) {
      toast.success("Recipe deleted successfully");
      router.refresh();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col gap-6">
        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full">
            <Select defaultValue="latest" onValueChange={setSortBy}>
              <SelectTrigger className="w-full ">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
            <Link href={"/create"}>
              <Button className="bg-blue-500">Create</Button>
            </Link>
            <Link href={"/measurement"}>
              <Button className="bg-blue-500">Create Measurement</Button>
            </Link>
          </div>
        </div>

        {/* Video Grid */}
          {loading ? (
            <div className="flex items-center w-full  justify-center h-screen bg-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="w-full">
                <CardHeader >
                  <div className="flex items-start">
                    <div className="w-full">
                      <Link className="w-full" href={`recipes/${video.id}`}>
                        <CardTitle>{video.title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          Posted on{" "}
                          {format(new Date(video.createdAt), "dd-LLL-yyyy")}
                        </CardDescription>
                      </Link>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => deletDataById(video.id)}
                    >
                      <Trash2 color="red" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p
                      className={`text-sm ${
                        !video.expanded ? "line-clamp-2" : ""
                      }`}
                    >
                      {video.description}
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => toggleDescription(video.id)}
                    >
                      {video.expanded ? "Show less" : "Read more"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
          )}

        {/* Pagination */}
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default VideoListing;
