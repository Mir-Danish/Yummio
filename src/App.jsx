import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BottomTabs from "./components/BottomTabs";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ChefsPage from "./pages/ChefsPage";
import ProfilePage from "./pages/ProfilePage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import CreatePage from "./pages/CreatePage";

// const Home = () => <div className="p-4 text-center text-xl">🏠 Home</div>;
// const Search = () => <div className="p-4 text-center text-xl">🔍 Search</div>;
// const Create = () => <div className="p-4 text-center text-xl">➕ Create</div>;
// const Chefs = () => <div className="p-4 text-center text-xl">👨‍🍳 Chefs</div>;
// const Profile = () => <div className="p-4 text-center text-xl">👤 Profile</div>;


function App() {
  return (
    <Router>
      <div className="pb-16 bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/chefs" element={<ChefsPage/>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
        </Routes>
        <BottomTabs />
      </div>
    </Router>
  );
}

export default App;


