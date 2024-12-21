import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

const IngredientList = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: "Flour", quantity: 500, unit: "g" },
    { id: 2, name: "Sugar", quantity: 200, unit: "g" },
    { id: 3, name: "Eggs", quantity: 4, unit: "pcs" },
  ]);

  const [newIngredient, setNewIngredient] = useState("");

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([
        ...ingredients,
        {
          id: Date.now(),
          name: newIngredient,
          quantity: 0,
          unit: "pcs",
        },
      ]);
      setNewIngredient("");
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

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Add new ingredient..."
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          className="flex-1"
        />
        <Button onClick={addIngredient} className="bg-secondary hover:bg-secondary/90">
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className="ingredient-item">
            <span className="font-medium">{ingredient.name}</span>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => updateQuantity(ingredient.id, false)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-16 text-center">
                {ingredient.quantity} {ingredient.unit}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => updateQuantity(ingredient.id, true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientList;