import Header from "@/components/Header";
import IngredientList from "@/components/IngredientList";
import RecipeChat from "@/components/RecipeChat";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-display font-semibold p-4 border-b">My Ingredients</h2>
            <IngredientList />
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-display font-semibold p-4 border-b">Recipe Assistant</h2>
            <RecipeChat />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;