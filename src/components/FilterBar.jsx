import { dummyDepartments } from "../utils/dummyData";

const categories = ["all", "exam", "event", "assignment", "academic", "general"];

export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200">

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilters((f) => ({ ...f, category: cat }))}
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-all border ${
              filters.category === cat
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
            }`}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>

      <div className="h-6 w-px bg-gray-200 hidden sm:block" />

      {/* Department dropdown — from Member 1's dummyDepartments */}
      <select
        value={filters.department}
        onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}
        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="All">All Departments</option>
        {dummyDepartments.map((d) => (
          <option key={d._id} value={d.name}>
            {d.name}
          </option>
        ))}
      </select>

      {/* Date sort */}
      <select
        value={filters.sort}
        onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
}