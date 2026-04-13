"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import api from "@/services/api";

interface SearchItem {
  _id: string;
  name: string;
  location?: string;
  company?: string;
  email?: string;
  [key: string]: string | undefined;
}

interface SearchSelectProps {
  type: 'EVENT' | 'EXHIBITOR';
  placeholder?: string;
  onSelect: (value: string, item: SearchItem) => void;
  className?: string;
  defaultValue?: string;
}

export function SearchSelect({ 
  type, 
  placeholder = "Search...", 
  onSelect, 
  className,
  defaultValue = ""
}: SearchSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [items, setItems] = React.useState<SearchItem[]>([]);
  const debouncedSearch = useDebounce(search, 500);

  const fetchItems = React.useCallback(async (query: string) => {
    if (!query) {
      setItems([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.get(`/dashboard/search?query=${query}&type=${type}`);
      setItems(response.data.data || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  React.useEffect(() => {
    fetchItems(debouncedSearch);
  }, [debouncedSearch, fetchItems]);

  const selectedItem = items.find((item) => item._id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-12 bg-white/5 border-white/10 font-bold uppercase tracking-tight", className)}
        >
          {value
            ? selectedItem?.name || value
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-slate-950 border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <Command className="bg-transparent" shouldFilter={false}>
          <div className="flex items-center border-b border-white/5 px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder={placeholder} 
              value={search}
              onValueChange={setSearch}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            {isLoading && <Loader2 className="h-4 w-4 animate-spin opacity-50" />}
          </div>
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm font-bold uppercase text-muted-foreground">No results found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item._id}
                  value={item._id}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onSelect(currentValue, item);
                    setOpen(false);
                  }}
                  className="py-3 px-4 font-bold uppercase tracking-tight hover:bg-white/5 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {type === 'EVENT' && item.location && (
                        <span className="text-[10px] text-muted-foreground">{item.location}</span>
                    )}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
