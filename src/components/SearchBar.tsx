import { useRef, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  showResults?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search creators...",
  children,
  isLoading,
  showResults,
  onFocus,
  onBlur,
}: SearchBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        onBlur?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleClear = () => {
    onChange("");
  };

  const isOpen = isFocused && showResults;

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="pl-12 pr-10 h-12 bg-secondary border-gold/20 focus:border-gold focus:ring-gold/30 text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && children && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-gold/20 rounded-lg shadow-xl shadow-black/20 z-50 overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
