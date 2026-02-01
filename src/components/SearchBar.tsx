import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "Search creators..." }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-12 h-12 bg-secondary border-gold/20 focus:border-gold focus:ring-gold/30 text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300"
      />
    </div>
  );
};

export default SearchBar;
