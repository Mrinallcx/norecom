import { Link, useNavigate } from "react-router-dom";
import { Play, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-gold p-2 rounded-lg shadow-gold group-hover:glow-gold transition-all duration-300">
            <Play className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
          <span className="text-xl font-light text-gradient-gold">
            StreamVault
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-gold/30 hover:bg-gold/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/auth")}
              className="border-gold/30 hover:bg-gold/10"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
