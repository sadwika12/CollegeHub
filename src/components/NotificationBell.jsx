export default function NotificationBell({ count = 3 }) {
  return (
    <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
      <span className="text-xl">🔔</span>
      {count > 0 && (
        <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}