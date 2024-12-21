import { useState, useEffect } from "react";
import { Plus, Minus, Trash2, CookingPot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category?: string;
}

const IngredientList = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [newUnit, setNewUnit] = useState("pcs");
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('name');
    
    if (error) {
      toast({
        title: "Error fetching ingredients",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setIngredients(data || []);
  };

  const addIngredient = async () => {
    if (newIngredient.trim()) {
      const { data, error } = await supabase
        .from('ingredients')
        .insert([{
          name: newIngredient,
          quantity: 1,
          unit: newUnit,
          category: newCategory || 'Other'
        }])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error adding ingredient",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setIngredients([...ingredients, data]);
      setNewIngredient("");
      setNewUnit("pcs");
      setNewCategory("");
      toast({
        title: "Ingredient added",
        description: `${newIngredient} has been added to your inventory.`,
      });
    }
  };

  const updateQuantity = async (id: string, increment: boolean) => {
    const ingredient = ingredients.find(ing => ing.id === id);
    if (!ingredient) return;

    const newQuantity = increment ? ingredient.quantity + 1 : Math.max(0, ingredient.quantity - 1);

    const { error } = await supabase
      .from('ingredients')
      .update({ quantity: newQuantity })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error updating quantity",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setIngredients(ingredients.map(ing =>
      ing.id === id ? { ...ing, quantity: newQuantity } : ing
    ));
  };

  const removeIngredient = async (id: string) => {
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error removing ingredient",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setIngredients(ingredients.filter(ing => ing.id !== id));
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
        <Input
          type="text"
          placeholder="Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-32"
        />
        <Button onClick={addIngredient} className="bg-secondary hover:bg-secondary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
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