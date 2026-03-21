export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-md">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      <input
        type="text"
        placeholder="Search announcements..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
      />
    </div>
  );
}