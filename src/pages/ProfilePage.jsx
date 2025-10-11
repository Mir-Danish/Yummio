import { useState, useEffect } from "react";
import { Settings, Grid, Bookmark, UserPlus, MessageCircle } from "lucide-react";
import { FaPlateWheat } from "react-icons/fa6";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  
  // Mock user data
  const user = {
    name: "Sarah Johnson",
    username: "@sarahjohnson",
    bio: "🍳 Passionate food Lover & Food Blogger | Healthy Recipe Creator | 📍 New York | Cooking is my love language",
    profileImage: "https://i.pravatar.cc/300?img=45",
    postsCount: 127,
    followers: 2543,
    following: 892
  };

  useEffect(() => {
    // Simulate initial page load
    const pageTimer = setTimeout(() => {
      setPageLoading(false);
    }, 800);
    return () => clearTimeout(pageTimer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadRecipes() {
      try {
        setLoading(true);
        
        // Fetch random recipe images from dummyjson
        const dummyRes = await fetch("https://dummyjson.com/recipes?limit=30");
        const dummyData = await dummyRes.json();
        const dummyImages = dummyData.recipes.map(r => r.image);
        
        // Fetch recipes from Firebase Firestore
        const recipesQuery = query(
          collection(db, "recipes"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(recipesQuery);
        
        if (cancelled) return;
        
        const fetchedRecipes = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          ...doc.data(),
          // Replace placeholder image with random dummyjson image
          image: dummyImages[index % dummyImages.length] || doc.data().image
        }));
        
        setRecipes(fetchedRecipes);
      } catch (e) {
        console.error("Failed to load recipes from Firebase:", e);
        setRecipes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadRecipes();
    return () => {
      cancelled = true;
    };
  }, []);

  if (pageLoading) {
    return (
      <div className="pb-20 md:pb-0 md:pl-60 bg-gray-50 min-h-screen">
        {/* Profile Header Skeleton */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto p-6">
            {/* Profile Info Skeleton */}
            <div className="flex items-start gap-6 mb-6 animate-pulse">
              {/* Profile Image Skeleton */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200"></div>
              </div>

              {/* User Info Skeleton */}
              <div className="flex-1 min-w-0 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-7 w-40 bg-gray-200 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                </div>

                {/* Stats Skeleton */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="h-6 w-12 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="text-center">
                    <div className="h-6 w-12 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="text-center">
                    <div className="h-6 w-12 bg-gray-200 rounded mb-1"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex gap-2">
                  <div className="h-10 flex-1 bg-gray-200 rounded-lg"></div>
                  <div className="h-10 w-14 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Bio Skeleton */}
            <div className="mb-4 animate-pulse space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex border-t border-gray-200 -mb-6 animate-pulse">
              <div className="flex-1 flex items-center justify-center gap-2 py-4">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 py-4">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area Skeleton */}
        <div className="max-w-2xl mx-auto p-4">
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <article key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm animate-pulse">
                <header className="flex items-center gap-3 p-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                  </div>
                </header>
                <div className="w-full bg-gray-200" style={{ height: 280 }} />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-56 bg-gray-200 rounded" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0 md:pl-60 bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto p-6">
          {/* Profile Info Section */}
          <div className="flex items-start gap-6 mb-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-orange-500 shadow-lg"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-500 text-sm">{user.username}</p>
                </div>
                <button className="text-gray-600 hover:text-gray-900">
                  <Settings className="w-6 h-6" />
                </button>
              </div>

              {/* Stats - Mobile Optimized */}
              <div className="flex gap-6 mb-4">
                <div className="text-center">
                  <div className="font-bold text-xl text-gray-900">{user.postsCount}</div>
                  <div className="text-gray-600 text-sm">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl text-gray-900">{user.followers.toLocaleString()}</div>
                  <div className="text-gray-600 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl text-gray-900">{user.following}</div>
                  <div className="text-gray-600 text-sm">Following</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Edit Profile
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">{user.bio}</p>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-gray-200 -mb-6">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-colors ${
                activeTab === "posts"
                  ? "text-orange-500 border-t-2 border-orange-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Grid className="w-5 h-5" />
              Posts
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold transition-colors ${
                activeTab === "saved"
                  ? "text-orange-500 border-t-2 border-orange-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Bookmark className="w-5 h-5" />
              Saved
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-2xl mx-auto p-4">
        {activeTab === "posts" ? (
          loading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <article key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <header className="flex items-center gap-3 p-4 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </div>
                  </header>
                  <div className="w-full bg-gray-200 animate-pulse" style={{ height: 280 }} />
                  <div className="p-4 space-y-3 animate-pulse">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-3 w-56 bg-gray-200 rounded" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Grid className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="font-semibold">No posts yet</p>
              <p className="text-sm mt-2">Start sharing your recipes</p>
            </div>
          ) : (
            <div className="space-y-6">
              {recipes.map((recipe) => (
                <article key={recipe.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <header className="flex items-center gap-3 p-4">
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{recipe.cuisine} • {recipe.difficulty}</div>
                    </div>
                  </header>

                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full max-h-[310px] object-cover"
                    loading="lazy"
                  />

                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-lg">{recipe.name}</h3>

                    <div className="text-sm text-gray-700">
                      <div className="font-medium mb-1">Ingredients</div>
                      <ul className="list-disc list-inside space-y-0.5">
                        {(recipe.ingredients ?? []).slice(0, 6).map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center place-content-between gap-4 pt-2 border-t border-gray-100">
                      <button type="button" className="flex flex-col items-center gap-1 text-gray-700 hover:text-red-500 transition-colors">
                        <GiForkKnifeSpoon />
                        <span className="text-sm">Bite</span>
                      </button>
                      <button type="button" className="flex flex-col items-center gap-1 text-gray-700 hover:text-blue-500 transition-colors">
                        <FaPlateWheat />
                        <span className="text-sm">Stir</span>
                      </button>
                      <button type="button" className="flex flex-col items-center gap-1 text-gray-700 hover:text-green-600 transition-colors">
                        <GiForkKnifeSpoon />
                        <span className="text-sm">Serve</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="font-semibold">No saved posts yet</p>
            <p className="text-sm mt-2">Save recipes and posts you love to view them here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;