import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-gold p-2 rounded-lg shadow-gold group-hover:glow-gold transition-all duration-300">
            <Play className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
          <span className="text-xl font-light text-gradient-gold">
            StreamVault
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
