import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Plus, X, Loader2, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    difficulty: "Easy",
    prepTime: "",
    cookTime: "",
    servings: "",
    ingredients: [""],
    instructions: [""],
  });

  useEffect(() => {
    // Simulate initial page load 
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInput = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayField = (index, field) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for forms
    if (!formData.name.trim()) {
      alert("Please enter a recipe name");
      return;
    }
    if (formData.ingredients.filter(i => i.trim()).length === 0) {
      alert("Please add at least one ingredient");
      return;
    }
    if (formData.instructions.filter(i => i.trim()).length === 0) {
      alert("Please add at least one instruction step");
      return;
    }

    setLoading(true);

    try {
      // Use default placeholder image here
      const defaultImageUrl = `https://picsum.photos/800/600?random=${Date.now()}`;

      // Prepare recipe data
      const recipeData = {
        name: formData.name.trim(),
        cuisine: formData.cuisine.trim() || "Other",
        difficulty: formData.difficulty,
        prepTime: formData.prepTime ? parseInt(formData.prepTime) : 0,
        cookTime: formData.cookTime ? parseInt(formData.cookTime) : 0,
        servings: formData.servings ? parseInt(formData.servings) : 1,
        ingredients: formData.ingredients.filter(i => i.trim()),
        instructions: formData.instructions.filter(i => i.trim()),
        image: defaultImageUrl,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0,
      };

      // Save to Firestore in db
      const docRef = await addDoc(collection(db, "recipes"), recipeData);
      
      alert("Recipe created successfully! 🎉");
      
      // Reset form
      setFormData({
        name: "",
        cuisine: "",
        difficulty: "Easy",
        prepTime: "",
        cookTime: "",
        servings: "",
        ingredients: [""],
        instructions: [""],
      });
      
      // Navigate to home or recipe detail page
      navigate("/");
      
    } catch (error) {
      console.error("Error creating recipe:", error);
      alert("Failed to create recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="pb-20 md:pb-0 md:pl-60 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto p-2 sm:p-4">
          {/* Header Skeleton */}
          <div className="mb-4 sm:mb-6 animate-pulse">
            <div className="h-8 sm:h-10 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded"></div>
          </div>

          {/* Form Skeleton for loading */}
          <div className="space-y-4 sm:space-y-6">
            {/* Image Note Skeleton */}
            <div className="bg-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-pulse">
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>

            {/* Basic Info Skeleton for loading*/}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 space-y-4 animate-pulse">
              <div className="h-6 w-40 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="h-10 w-full bg-gray-200 rounded"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Ingredients Skeleton for loading */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 space-y-3 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Instructions Skeleton for loading*/}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 space-y-3 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="h-20 w-full bg-gray-200 rounded"></div>
              <div className="h-20 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Buttons Skeleton for loading */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-pulse">
              <div className="h-12 flex-1 bg-gray-200 rounded-lg"></div>
              <div className="h-12 flex-1 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0 md:pl-60 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto p-2 sm:p-4">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            Create Recipe
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">Share your delicious recipe with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Recipe Image Note */}
          <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200">
            <p className="text-xs sm:text-sm text-blue-800">
              📸 A default placeholder image will be automatically added to your recipe.
            </p>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Spaghetti Carbonara"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine
                </label>
                <input
                  type="text"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Italian"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prep Time (min)
                </label>
                <input
                  type="number"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="15"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cook Time (min)
                </label>
                <input
                  type="number"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="30"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servings
                </label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="4"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Ingredients *</h3>
            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleArrayInput(index, e.target.value, "ingredients")}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, "ingredients")}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField("ingredients")}
                className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Ingredient
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Instructions *</h3>
            <div className="space-y-3">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm mt-2">
                    {index + 1}
                  </div>
                  <textarea
                    value={instruction}
                    onChange={(e) => handleArrayInput(index, e.target.value, "instructions")}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[80px]"
                    placeholder={`Step ${index + 1}`}
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField(index, "instructions")}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors h-fit mt-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField("instructions")}
                className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium ml-10"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5" />
                  Create Recipe
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;