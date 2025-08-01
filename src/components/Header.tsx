import { Button } from "@/components/ui/button";
import { BookOpen, User, Menu, Search } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">Pavex Lingo</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Courses
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Tests
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Dictionary
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Blog
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="font-medium">
              Login
            </Button>
            <Button className="btn-primary">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-in">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Courses
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Tests
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Dictionary
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                Blog
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
                <Button className="w-full btn-primary">
                  Sign Up
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;