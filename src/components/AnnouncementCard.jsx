import { useState } from "react";

const categoryColors = {
  exam:       "bg-red-100 text-red-700",
  event:      "bg-blue-100 text-blue-700",
  assignment: "bg-yellow-100 text-yellow-700",
  academic:   "bg-purple-100 text-purple-700",
  general:    "bg-gray-100 text-gray-600",
};

const roleLabels = {
  admin:        "Admin",
  faculty:      "Faculty",
  hod:          "HOD",
  dean:         "Dean",
  cell:         "Cell",
  organization: "Org",
};

export default function AnnouncementCard({ announcement }) {
  const [bookmarked, setBookmarked] = useState(false);
  const { title, content, category, postedBy, createdAt, isImportant, department } = announcement;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-3 transition hover:shadow-md ${
      isImportant ? "border-l-4 border-l-red-500" : "border-gray-200"
    }`}>

      {/* Top row — badges + bookmark */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2 items-center">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${categoryColors[category] || "bg-gray-100 text-gray-600"}`}>
            {category}
          </span>
          {isImportant && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-500 text-white">
              Important
            </span>
          )}
          {department && (
            <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
              {department}
            </span>
          )}
        </div>

        <button
          onClick={() => setBookmarked(!bookmarked)}
          className="text-gray-400 hover:text-indigo-500 transition text-xl"
          title={bookmarked ? "Remove bookmark" : "Bookmark"}
        >
          {bookmarked ? "🔖" : "🏷️"}
        </button>
      </div>

      {/* Title */}
      <h3 className="text-gray-900 font-semibold text-base leading-snug">{title}</h3>

      {/* Content */}
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{content}</p>

      {/* Footer — postedBy now has _id, name, role */}
      <div className="flex justify-between items-center text-xs text-gray-400 pt-1 border-t border-gray-100">
        <span>
          Posted by{" "}
          <span className="font-medium text-gray-600">{postedBy.name}</span>
          <span className="ml-1 px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 capitalize">
            {roleLabels[postedBy.role] || postedBy.role}
          </span>
        </span>
        <span>{createdAt}</span>
      </div>
    </div>
  );
}