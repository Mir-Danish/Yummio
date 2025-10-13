import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share2, ChefHat } from "lucide-react";
import { FaPlateWheat } from "react-icons/fa6";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { UtensilsCrossed } from 'lucide-react';
import { Soup } from 'lucide-react';
import { db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const HomePage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipeActions, setRecipeActions] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from both dummyjson and Firebase
        const [dummyJsonResponse, firebaseRecipes] = await Promise.all([
          fetch("https://dummyjson.com/recipes").then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          }),
          getDocs(query(collection(db, "recipes"), orderBy("createdAt", "desc")))
            .then(snapshot => snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              source: "firebase" // Mark source for rendering
            })))
            .catch(err => {
              console.warn("Firebase fetch failed:", err);
              return []; // Return empty array if Firebase fails
            })
        ]);
        
        if (cancelled) return;
        
        // Combine recipes from both sources
        const dummyRecipes = Array.isArray(dummyJsonResponse?.recipes) 
          ? dummyJsonResponse.recipes.map(r => ({ ...r, source: "dummyjson" }))
          : [];
        
        const combinedRecipes = [...firebaseRecipes, ...dummyRecipes];
        
        console.log("Recipes fetched:", {
          firebase: firebaseRecipes.length,
          dummyjson: dummyRecipes.length,
          total: combinedRecipes.length
        });
        
        setRecipes(combinedRecipes);
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

  const toggleAction = (recipeId, actionType) => {
    setRecipeActions(prev => ({
      ...prev,
      [recipeId]: {
        ...prev[recipeId],
        [actionType]: (prev[recipeId]?.[actionType] || 0) + 1
      }
    }));
  };

  if (loading)
    return (
      <div className="pb-20 md:pb-0 md:pl-60 bg-gray-50 min-h-screen">
        {/* Logo Header for Mobile */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 md:hidden">
          <div className="flex items-center gap-2 p-3">
            <ChefHat className="w-6 h-6 text-orange-500" />
            <span className="font-bold text-lg">Yummio</span>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto">
          {/* Feed Skeleton */}
          <div className="space-y-4 py-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <article key={i} className="bg-white border border-gray-200">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                    <div className="h-2 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
                {/* Image */}
                <div className="h-96 bg-gray-200 animate-pulse" />
                {/* Actions */}
                <div className="p-4 space-y-3">
                  <div className="flex gap-4">
                    <div className="h-6 w-6 bg-gray-200 rounded" />
                    <div className="h-6 w-6 bg-gray-200 rounded" />
                    <div className="h-6 w-6 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-3/4 bg-gray-200 rounded" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
    
  if (error) return (
    <div className="pb-20 md:pb-0 md:pl-60 bg-gray-50 min-h-screen">
      {/* Logo Header for Mobile */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 md:hidden">
        <div className="flex items-center gap-2 p-3">
          <ChefHat className="w-6 h-6 text-orange-500" />
          <span className="font-bold text-lg">Yummio</span>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center text-red-600 bg-red-50 rounded-lg p-8 mt-8">
          <p className="text-lg font-semibold">Error: {error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-20 md:pb-0 md:pl-60 bg-gradient-to-br from-orange-50 via-white to-red-50 min-h-screen">
      {/* Logo Header for Mobile */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-orange-200 md:hidden">
        <div className="flex items-center gap-2 p-3">
          <ChefHat className="w-6 h-6 text-orange-500" />
          <span className="font-bold text-lg">Yummio</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="mb-6 sm:mb-8 hidden md:block">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
            Discover Delicious Recipes
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Explore our collection of amazing dishes from around the world
          </p>
        </div>
      
        {recipes.length === 0 && (
          <div className="text-center text-gray-500 py-12">No recipes found.</div>
        )}

        {/* Vertical Post Feed */}
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <article 
              key={recipe.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-280"
            >
              {/* Image with Overlay */}
              <div 
                className="relative h-80 sm:h-96 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/recipes/${recipe.id}`)}
              >
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                    {recipe.cuisine || "Other"}
                  </span>
                  <span className={`px-2 py-1 text-white text-xs font-semibold rounded-full ${
                    recipe.difficulty === 'Easy' ? 'bg-green-500' :
                    recipe.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {recipe.difficulty || "Medium"}
                  </span>
                </div>

                {/* Recipe Name on Image */}
                <h3 className="absolute bottom-3 left-3 right-3 text-white font-bold text-xl sm:text-2xl line-clamp-2">
                  {recipe.name}
                </h3>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Quick Info */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  {recipe.prepTime && (
                    <span className="flex items-center gap-1">
                      <ChefHat className="w-3 h-3" />
                      {recipe.prepTime}m prep
                    </span>
                  )}
                  {recipe.servings && (
                    <span>🍽️ {recipe.servings} servings</span>
                  )}
                </div>

                {/* Ingredients Preview */}
                <div className="text-xs text-gray-600">
                  <p className="font-medium text-gray-800 mb-1">Key Ingredients:</p>
                  <p className="line-clamp-2">
                    {(recipe.ingredients ?? []).slice(0, 3).join(', ')}
                    {(recipe.ingredients?.length || 0) > 3 && '...'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-around pt-3 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAction(recipe.id, 'bite');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      recipeActions[recipe.id]?.bite 
                        ? 'bg-orange-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                    }`}
                  >
                    <GiForkKnifeSpoon className="w-4 h-4" />
                    <span className="text-sm font-bold">{recipeActions[recipe.id]?.bite || 0}</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAction(recipe.id, 'stir');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      recipeActions[recipe.id]?.stir 
                        ? 'bg-orange-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                    }`}
                  >
                    <FaPlateWheat className="w-4 h-4" />
                    <span className="text-sm font-bold">{recipeActions[recipe.id]?.stir || 0}</span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAction(recipe.id, 'serve');
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      recipeActions[recipe.id]?.serve 
                        ? 'bg-orange-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                    }`}
                  >
                    <UtensilsCrossed  className="w-4 h-4" />
                    <span className="text-sm font-bold">{recipeActions[recipe.id]?.serve || 0}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;