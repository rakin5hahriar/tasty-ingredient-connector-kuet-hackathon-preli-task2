import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <h1 className="text-2xl font-display font-bold text-primary mr-6">Recipe Assistant</h1>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6 hidden md:block">
          <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary">
            Ingredients
          </Button>
          <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary">
            Recipes
          </Button>
          <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary">
            Chat
          </Button>
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;