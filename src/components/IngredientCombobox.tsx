import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import type { Ingredient } from "@/domain/types";

interface IngredientComboboxProps {
  ingredients: Ingredient[];
  onSelect: (ingredientId: string) => void;
  placeholder?: string;
  addedIngredientIds?: string[];
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    };

    checkMobile();
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    mediaQuery.addEventListener("change", checkMobile);

    return () => mediaQuery.removeEventListener("change", checkMobile);
  }, []);

  return isMobile;
}

export function IngredientCombobox({
  ingredients,
  onSelect,
  placeholder = "Выберите ингредиент...",
  addedIngredientIds = [],
}: IngredientComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [search, setSearch] = React.useState("");
  const isMobile = useIsMobile();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus input when drawer opens on mobile
  React.useEffect(() => {
    if (open && isMobile) {
      // Delay to ensure drawer is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, isMobile]);

  // Filter ingredients based on search
  const filteredIngredients = React.useMemo(() => {
    if (!search) return ingredients.slice(0, 50);
    const searchLower = search.toLowerCase();
    return ingredients
      .filter((ing) => {
        const displayName = ing.name_ru ?? ing.name;
        const spanishName = ing.name;
        return (
          displayName.toLowerCase().includes(searchLower) ||
          spanishName.toLowerCase().includes(searchLower)
        );
      })
      .slice(0, 50);
  }, [ingredients, search]);

  const handleSelect = (currentValue: string) => {
    if (!currentValue) return;
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onSelect(currentValue);
    setSearch("");
  };

  // Shared command list component
  const commandContent = (
    <Command shouldFilter={false} className="rounded-none border-none">
      <CommandInput
        ref={inputRef}
        placeholder="Искать ингредиент..."
        value={search}
        onValueChange={setSearch}
        className="border-none"
      />
      <CommandList className="max-h-[300px] border-none">
        <CommandEmpty>Ингредиент не найден.</CommandEmpty>
        <CommandGroup>
          {filteredIngredients.map((ingredient) => {
            const displayName = ingredient.name_ru ?? ingredient.name;
            const isAdded = addedIngredientIds.includes(ingredient.id);

            return (
              <CommandItem
                key={ingredient.id}
                value={String(ingredient.id)}
                onSelect={handleSelect}
                disabled={isAdded}
                className={cn(isAdded && "opacity-50 cursor-not-allowed")}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    isAdded ? "opacity-100" : "opacity-0",
                  )}
                />
                {displayName}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh] p-0">
          {commandContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        {commandContent}
      </PopoverContent>
    </Popover>
  );
}
