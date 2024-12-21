import { useState, useEffect } from "react";
import { Send, CookingPot, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface Recipe {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  file_path?: string;
}

const RecipeChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your recipe assistant. What would you like to cook today? I can suggest recipes based on your available ingredients or specific preferences. You can also upload recipe files or images!",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error fetching recipes",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setRecipes(data || []);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('recipes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('recipes')
        .insert({
          title: file.name.replace(`.${fileExt}`, ''),
          file_path: filePath,
          file_type: file.type,
        });

      if (dbError) throw dbError;

      toast({
        title: "Recipe uploaded",
        description: "Your recipe file has been uploaded successfully.",
      });

      fetchRecipes();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user" as const,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data: ingredients } = await supabase
        .from('ingredients')
        .select('name')
        .order('name');

      const ingredientsList = ingredients?.map(ing => ing.name) || [];

      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: { prompt: input, ingredients: ingredientsList },
      });

      if (error) throw error;

      const botMessage = {
        id: Date.now() + 1,
        text: data.text,
        sender: "bot" as const,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get recipe suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.sender === "user"
                ? "bg-primary/10 ml-auto"
                : "bg-secondary/10"
            } max-w-[80%]`}
          >
            {message.sender === "bot" && (
              <CookingPot className="h-4 w-4 text-secondary mb-2" />
            )}
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2 mb-2">
          <Input
            type="file"
            id="recipe-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".txt,.pdf,.jpg,.jpeg,.png"
          />
          <label
            htmlFor="recipe-upload"
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            Upload Recipe
          </label>
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about recipes or cooking suggestions..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            className="bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeChat;