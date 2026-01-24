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
import type { Ingredient } from "@/domain/types";

interface IngredientComboboxProps {
  ingredients: Ingredient[];
  onSelect: (ingredientName: string) => void;
  placeholder?: string;
  addedIngredientNames?: string[];
}

export function IngredientCombobox({
  ingredients,
  onSelect,
  placeholder = "Выберите ингредиент...",
  addedIngredientNames = [],
}: IngredientComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [search, setSearch] = React.useState("");

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
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onSelect(currentValue);
    // Reset search after selection
    setSearch("");
  };

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
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Искать ингредиент..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Ингредиент не найден.</CommandEmpty>
            <CommandGroup>
              {filteredIngredients.map((ingredient) => {
                const displayName = ingredient.name_ru ?? ingredient.name;
                const showSpanishName =
                  ingredient.name_ru && ingredient.name !== ingredient.name_ru;
                const isAdded = addedIngredientNames.includes(ingredient.name);

                return (
                  <CommandItem
                    key={ingredient.id}
                    value={ingredient.name}
                    onSelect={handleSelect}
                    disabled={isAdded}
                    className={cn(
                      "flex flex-col items-start",
                      isAdded && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center w-full">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isAdded ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1">
                        <div>{displayName}</div>
                        {showSpanishName && (
                          <div className="text-xs text-muted-foreground">
                            {ingredient.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
