import { useState, useMemo } from "react";
import { dummyAnnouncements } from "../utils/dummyData";
import { useAuth } from "../context/AuthContext";
import AnnouncementCard from "../components/AnnouncementCard";
import FilterBar from "../components/FilterBar";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";

export default function StudentFeed() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    department: "All",
    sort: "newest",
  });

  const filtered = useMemo(() => {
    let result = [...dummyAnnouncements];

    // Search across title and content
    if (search.trim()) {
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== "all") {
      result = result.filter((a) => a.category === filters.category);
    }

    // Department filter
    // null department = posted for everyone, always show
    // specific department = only show if it matches selected
    if (filters.department !== "All") {
      result = result.filter(
        (a) => a.department === null || a.department === filters.department
      );
    }

    // Sort by date
    result.sort((a, b) =>
      filters.sort === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    return result;
  }, [search, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, {user?.name} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {user?.department
              ? `Showing announcements for you and ${user.department} department.`
              : "Showing all announcements."}
          </p>
        </div>

        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Filters */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Count */}
        <p className="text-xs text-gray-400">
          Showing {filtered.length} announcement{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Cards */}
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((a) => (
              <AnnouncementCard key={a._id} announcement={a} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">No announcements match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}