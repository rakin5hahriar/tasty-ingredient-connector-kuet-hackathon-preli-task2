import { useState } from "react";
import { Send, CookingPot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ChatResponse {
  text: string;
}

const RecipeChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your recipe assistant. What would you like to cook today? I can suggest recipes based on your available ingredients or specific preferences.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      // Get available ingredients from the ingredients list
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
    } catch (error) {
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
            className={`chat-message ${
              message.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            {message.sender === "bot" && (
              <CookingPot className="h-4 w-4 text-secondary mb-2" />
            )}
            {message.text}
          </div>
        ))}
      </div>
      <div className="border-t p-4">
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