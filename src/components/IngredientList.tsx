import { useState } from "react";
import { Plus, Minus, Trash2, CookingPot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category?: string;
  expiryDate?: string;
}

const IngredientList = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: "Flour", quantity: 500, unit: "g", category: "Baking" },
    { id: 2, name: "Sugar", quantity: 200, unit: "g", category: "Baking" },
    { id: 3, name: "Eggs", quantity: 4, unit: "pcs", category: "Dairy" },
  ]);

  const [newIngredient, setNewIngredient] = useState("");
  const [newUnit, setNewUnit] = useState("pcs");
  const { toast } = useToast();

  const addIngredient = () => {
    if (newIngredient.trim()) {
      const ingredient = {
        id: Date.now(),
        name: newIngredient,
        quantity: 1,
        unit: newUnit,
        category: "Other",
      };
      setIngredients([...ingredients, ingredient]);
      setNewIngredient("");
      toast({
        title: "Ingredient added",
        description: `${newIngredient} has been added to your inventory.`,
      });
    }
  };

  const updateQuantity = (id: number, increment: boolean) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id
          ? { ...ing, quantity: increment ? ing.quantity + 1 : Math.max(0, ing.quantity - 1) }
          : ing
      )
    );
  };

  const removeIngredient = (id: number) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
    toast({
      title: "Ingredient removed",
      description: "The ingredient has been removed from your inventory.",
    });
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Add new ingredient..."
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          className="flex-1"
          onKeyPress={(e) => e.key === "Enter" && addIngredient()}
        />
        <Input
          type="text"
          placeholder="Unit"
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
          className="w-24"
        />
        <Button onClick={addIngredient} className="bg-secondary hover:bg-secondary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className="ingredient-item">
            <div className="flex items-center gap-2">
              <CookingPot className="h-4 w-4 text-primary" />
              <span className="font-medium">{ingredient.name}</span>
              <span className="text-sm text-gray-500">({ingredient.category})</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => updateQuantity(ingredient.id, false)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-24 text-center">
                {ingredient.quantity} {ingredient.unit}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => updateQuantity(ingredient.id, true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={() => removeIngredient(ingredient.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientList;