// src/Presentation/components/Sidebar.tsx
interface SidebarProps {
  tab: "dashboard" | "planner" | "list";
  setTab: (t: "dashboard" | "planner" | "list") => void;
  shoppingCount: number;
}

export function Sidebar({ tab, setTab, shoppingCount }: SidebarProps) {
  return (
    <aside className="w-full lg:w-64 bg-white shadow-md flex flex-col justify-between">
      <div>
        <div className="p-4 flex items-center gap-2 border-b border-green-500">
          <div className="w-8 h-8 bg-green-500 rounded-sm"></div>
          <h1 className="font-bold text-xl">Meal Planner</h1>
        </div>
        <nav className="px-4 py-4 space-y-2">
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "planner", label: "Meal Planner" },
            { key: "list", label: "Shopping List" }, // ✅
          ].map((link) => (
            <button
              key={link.key}
              onClick={() => setTab(link.key as any)}
              className={`w-full text-left tracking-wider text-sm block px-3 py-2 rounded-lg ${
                tab === link.key
                  ? "bg-green-100 text-green-700"
                  : "hover:bg-green-100 text-gray-500"
              }`}
            >
              {link.label}
              {link.key === "list" && (
                <span className="float-right inline-flex items-center justify-center w-7 h-7 text-xs text-green-700 bg-green-100 rounded-full">
                  {shoppingCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
