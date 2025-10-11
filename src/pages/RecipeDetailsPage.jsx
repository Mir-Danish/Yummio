import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaPlateWheat } from "react-icons/fa6";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        
        // First, try to fetch from Firebase
        try {
          const docRef = doc(db, "recipes", id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            if (cancelled) return;
            setRecipe({ id: docSnap.id, ...docSnap.data() });
            setLoading(false);
            return;
          }
        } catch (firebaseError) {
          console.warn("Firebase fetch failed, trying dummyjson:", firebaseError);
        }
        
        // If not in Firebase, try dummyjson API
        const res = await fetch(`https://dummyjson.com/recipes/${id}`);
        if (!res.ok) throw new Error(`Recipe not found`);
        const data = await res.json();
        if (cancelled) return;
        setRecipe(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load recipe");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading)
    return (
      <div className="p-4 pb-20 md:pb-0 md:pl-60 max-w-2xl mx-auto space-y-4">
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        <article className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="w-full bg-gray-200 animate-pulse" style={{ height: 280 }} />
          <div className="p-4 space-y-3 animate-pulse">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="space-y-2">
              <div className="h-3 w-56 bg-gray-200 rounded" />
              <div className="h-3 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-64 bg-gray-200 rounded" />
            </div>
          </div>
        </article>
      </div>
    );

  if (error) return <div className="p-4 pb-20 md:pb-0 md:pl-60 text-center text-red-600">Error: {error}</div>;

  if (!recipe) return null;

  return (
    <div className="p-2 sm:p-4 pb-20 md:pb-0 md:pl-60 max-w-2xl mx-auto space-y-3 sm:space-y-4 text-black">
      <div>
        <Link to={-1} className="text-blue-600 hover:underline text-xs sm:text-sm">← Back</Link>
      </div>

      <article className="rounded-lg sm:rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <header className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
          <img
            src={`https://i.pravatar.cc/100?img=${(recipe.userId ?? recipe.id) % 70}`}
            alt="User avatar"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover"
            loading="lazy"
          />
          <div className="min-w-0">
            <div className="font-semibold text-sm sm:text-base truncate">Jane Doe</div>
            <div className="text-xs text-gray-500 truncate">{recipe.cuisine} • {recipe.difficulty}</div>
          </div>
        </header>

        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full max-h-[280px] sm:max-h-[380px] object-cover"
          loading="lazy"
        />

        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          <h1 className="font-semibold text-xl sm:text-2xl">{recipe.name}</h1>

          <div className="text-xs sm:text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="font-medium mb-1">Ingredients</div>
              <ul className="list-disc list-inside space-y-0.5">
                {(recipe.ingredients ?? []).map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium mb-1">Details</div>
              <ul className="list-disc list-inside space-y-0.5">
                {(recipe.prepTimeMinutes != null || recipe.prepTime != null) && (
                  <li>Prep time: {recipe.prepTimeMinutes || recipe.prepTime} mins</li>
                )}
                {(recipe.cookTimeMinutes != null || recipe.cookTime != null) && (
                  <li>Cook time: {recipe.cookTimeMinutes || recipe.cookTime} mins</li>
                )}
                {recipe.servings != null && (
                  <li>Servings: {recipe.servings}</li>
                )}
                {recipe.caloriesPerServing != null && (
                  <li>Calories/serving: {recipe.caloriesPerServing}</li>
                )}
                {recipe.rating != null && (
                  <li>Rating: {recipe.rating} ({recipe.reviewCount ?? 0} reviews)</li>
                )}
                {Array.isArray(recipe.mealType) && recipe.mealType.length > 0 && (
                  <li>Meal type: {recipe.mealType.join(", ")}</li>
                )}
                {recipe.difficulty && (
                  <li>Difficulty: {recipe.difficulty}</li>
                )}
              </ul>
            </div>
          </div>

          {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
            <div className="text-xs sm:text-sm text-gray-700">
              <div className="font-medium mb-1">Instructions</div>
              <ol className="list-decimal list-inside space-y-0.5">
                {recipe.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="flex items-center place-content-between gap-2 sm:gap-4 pt-2 border-t border-gray-100">
            <button type="button" className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-700 hover:text-red-500 transition-colors">
              <GiForkKnifeSpoon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">Bite</span>
            </button>
            <button type="button" className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-700 hover:text-blue-500 transition-colors">
              <FaPlateWheat className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">Stir</span>
            </button>
            <button type="button" className="flex flex-col items-center gap-0.5 sm:gap-1 text-gray-700 hover:text-green-600 transition-colors">
              <GiForkKnifeSpoon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm">Serve</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default RecipeDetailsPage;
