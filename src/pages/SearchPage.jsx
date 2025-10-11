import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://dummyjson.com/recipes");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setRecipes(Array.isArray(data?.recipes) ? data.recipes : []);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return recipes;
    return recipes.filter((r) => {
      const hay = [
        r?.name,
        r?.cuisine,
        r?.difficulty,
        ...(Array.isArray(r?.ingredients) ? r.ingredients : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(term);
    });
  }, [q, recipes]);

  if (loading)
    return (
      <div className="p-4 pb-20 md:pb-0 md:pl-60 max-w-3xl mx-auto space-y-4">
        <div className="sticky top-0 bg-white z-10 pb-2">
          <div className="h-10 rounded-lg bg-gray-200 animate-pulse" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="w-full bg-gray-200 animate-pulse" style={{ height: 160 }} />
            <div className="p-4 space-y-2 animate-pulse">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-56 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );

  if (error)
    return (
      <div className="p-4 pb-20 md:pb-0 md:pl-60 text-center text-red-600">Error: {error}</div>
    );

  return (
    <div className="p-2 sm:p-4 pb-20 md:pb-0 md:pl-60 max-w-3xl mx-auto space-y-3 sm:space-y-4 text-black">
      <div className="sticky top-0 bg-white z-10 pb-2">
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg sm:rounded-xl px-3 py-2 shadow-sm">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search recipes, ingredients..."
            className="w-full bg-transparent outline-none text-xs sm:text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-500">No recipes match your search.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {filtered.map((r) => (
          <Link key={r.id} to={`/recipes/${r.id}`} className="group">
            <article className="rounded-lg sm:rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src={r.image}
                alt={r.name}
                className="w-full h-32 sm:h-40 object-cover"
                loading="lazy"
              />
              <div className="p-2.5 sm:p-3 space-y-1 sm:space-y-1.5">
                <h3 className="font-semibold text-sm sm:text-base truncate">{r.name}</h3>
                <div className="text-xs text-gray-600 truncate">{r.cuisine} • {r.difficulty}</div>
                <div className="text-xs text-gray-700 line-clamp-2">
                  {(r.ingredients ?? []).slice(0, 4).join(", ")}
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;