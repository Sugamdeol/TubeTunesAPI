import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  "data-testid"?: string;
}

export function SearchBar({ value, onChange, "data-testid": testId }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  const { data: suggestions } = useQuery({
    queryKey: ['/api/suggestions', debouncedValue],
    enabled: !!debouncedValue && debouncedValue.length > 1,
    queryFn: async ({ queryKey }) => {
      const [, query] = queryKey;
      const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query as string)}`);
      if (!response.ok) return { suggestions: [], recent: [] };
      return response.json();
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
  };

  return (
    <div className="flex-1 flex justify-center lg:ml-6 lg:mr-6">
      <div className="max-w-lg w-full lg:max-w-xs relative" ref={containerRef}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder="Search songs, artists, albums..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            data-testid={testId}
          />
        </div>
        
        {isOpen && (suggestions?.suggestions?.length > 0 || suggestions?.recent?.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-72 overflow-y-auto">
            <div className="py-2">
              {suggestions?.recent?.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    Recent Searches
                  </div>
                  {suggestions.recent.map((item: string, index: number) => (
                    <button
                      key={`recent-${index}`}
                      className="w-full text-left block px-4 py-2 text-sm text-popover-foreground hover:bg-secondary"
                      onClick={() => handleSuggestionClick(item)}
                      data-testid={`suggestion-recent-${index}`}
                    >
                      <Search className="inline mr-2 h-3 w-3 text-muted-foreground" />
                      {item}
                    </button>
                  ))}
                </>
              )}
              
              {suggestions?.suggestions?.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    Suggestions
                  </div>
                  {suggestions.suggestions.map((item: string, index: number) => (
                    <button
                      key={`suggestion-${index}`}
                      className="w-full text-left block px-4 py-2 text-sm text-popover-foreground hover:bg-secondary"
                      onClick={() => handleSuggestionClick(item)}
                      data-testid={`suggestion-${index}`}
                    >
                      <Search className="inline mr-2 h-3 w-3 text-muted-foreground" />
                      {item}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
