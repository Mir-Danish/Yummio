import { useState, useEffect } from "react";
import { ChefHat, Star, MapPin, Utensils } from "lucide-react";

const ChefsPage = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hiredChefs, setHiredChefs] = useState(new Set());

  useEffect(() => {
    let cancelled = false;
    async function loadChefs() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://dummyjson.com/users?limit=20");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        console.log("Chefs fetched:", data);
        
        // Transform users into chefs with additional chef-specific data
        const transformedChefs = (data?.users || []).map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          specialty: ["Italian", "French", "Japanese", "Mexican", "Indian", "Thai", "Chinese", "Mediterranean"][user.id % 8],
          rating: (4 + Math.random()).toFixed(1),
          experience: Math.floor(Math.random() * 15) + 5,
          location: user.address?.city || "New York",
          image: user.image,
          hourlyRate: Math.floor(Math.random() * 100) + 50,
          dishes: Math.floor(Math.random() * 100) + 20
        }));
        
        setChefs(transformedChefs);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load chefs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadChefs();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleHire = (chef) => {
    alert(`Hiring request sent to ${chef.name}!\nSpecialty: ${chef.specialty}\nRate: $${chef.hourlyRate}/hr`);
    // Mark this chef as hired
    setHiredChefs(prev => new Set([...prev, chef.id]));
    // TODO: Implement actual hiring logic (e.g., send to backend, open modal, etc.)
  };

  if (loading) {
    return (
      <div className="p-2 sm:p-4 max-w-6xl mx-auto pb-20 md:pb-0 md:pl-60">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ChefHat className="w-6 h-6 sm:w-8 sm:h-8" />
            Our Chefs
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">Discover talented chefs for your culinary needs</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="h-40 sm:h-48 bg-gray-200 animate-pulse" />
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4 max-w-6xl mx-auto pb-20 md:pb-0 md:pl-60">
        <div className="text-center text-red-600 p-6 sm:p-8 bg-red-50 rounded-lg sm:rounded-xl">
          <p className="font-semibold text-sm sm:text-base">Error loading chefs</p>
          <p className="text-xs sm:text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 max-w-6xl mx-auto pb-20 md:pb-0 md:pl-60">
      <header className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ChefHat className="w-6 h-6 sm:w-8 sm:h-8" />
          Our Chefs
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2">Discover talented chefs for your culinary needs</p>
      </header>

      {chefs.length === 0 ? (
        <div className="text-center text-gray-500 py-8 sm:py-12 text-sm sm:text-base">No chefs available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {chefs.map((chef) => (
            <article key={chef.id} className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-40 sm:h-48">
                <img
                  src={"https://cdn.pixabay.com/photo/2012/04/26/19/43/profile-42914_1280.png"}
                  alt={chef.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white rounded-full px-2 py-1 sm:px-3 sm:py-1 flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs sm:text-sm font-semibold">{chef.rating}</span>
                </div>
              </div>

              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900">{chef.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Utensils className="w-3 h-3 sm:w-4 sm:h-4" />
                    {chef.specialty} Cuisine
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    {chef.location}
                  </span>
                  <span className="font-medium">{chef.experience} yrs exp</span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-xs sm:text-sm text-gray-600">{chef.dishes}+ dishes</span>
                    <span className="font-bold text-base sm:text-lg text-gray-900">${chef.hourlyRate}/hr</span>
                  </div>
                  <button
                    onClick={() => handleHire(chef)}
                    disabled={hiredChefs.has(chef.id)}
                    className={`w-full font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base ${
                      hiredChefs.has(chef.id)
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                    }`}
                  >
                    <ChefHat className="w-3 h-3 sm:w-4 sm:h-4" />
                    {hiredChefs.has(chef.id) ? 'Request Sent' : 'Hire Chef'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChefsPage;