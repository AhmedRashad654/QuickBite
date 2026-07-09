import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGeocode, type GeocodeResult } from "@/hooks/useGeocode";
import { LoaderIcon, MapPinIcon } from "lucide-react";

interface AddressInputProps {
  value?: string;
  onSelect: (result: GeocodeResult) => void;
  placeholder?: string;
  className?: string;
}

export function AddressInput({
  value,
  onSelect,
  placeholder = "Search address...",
  className,
}: AddressInputProps) {
  const [query, setQuery] = useState(value ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { results, isLoading, error } = useGeocode(query);

  const handleSelect = useCallback(
    (result: GeocodeResult) => {
      setQuery(result.displayName);
      setIsOpen(false);
      setHighlightIndex(-1);
      onSelect(result);
    },
    [onSelect],
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setHighlightIndex(-1);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightIndex >= 0 && highlightIndex < results.length) {
            handleSelect(results[highlightIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setHighlightIndex(-1);
          break;
      }
    },
    [isOpen, results, highlightIndex, handleSelect],
  );

  useEffect(() => {
    if (!isOpen) return;
    if (highlightIndex < 0) return;
    const item = listRef.current?.children[highlightIndex] as
      | HTMLElement
      | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target)
      ) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setQuery(value ?? "");
    }, 0);
  }, [value]);

  const showDropdown = isOpen && query.trim().length >= 3;

  return (
    <div className={cn("relative", className)}>
      <Input
        ref={inputRef}
        value={query}
        onChange={handleChange}
        onFocus={() => {
          if (query.trim().length >= 3) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="address-listbox"
        aria-activedescendant={
          highlightIndex >= 0 ? `address-option-${highlightIndex}` : undefined
        }
      />
      {showDropdown && (
        <ul
          ref={listRef}
          id="address-listbox"
          role="listbox"
          className={cn(
            "absolute z-50 mt-1 w-full min-w-0 rounded-lg border bg-popover p-1 text-sm shadow-md",
            "max-h-48 overflow-y-auto",
          )}
        >
          {isLoading && (
            <li className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
              <LoaderIcon className="size-3.5 animate-spin" />
              Searching...
            </li>
          )}
          {error && <li className="px-2 py-1.5 text-destructive">{error}</li>}
          {!isLoading && !error && results.length === 0 && (
            <li className="px-2 py-1.5 text-muted-foreground">
              No addresses found
            </li>
          )}
          {!isLoading &&
            results.map((result, index) => (
              <li
                key={index}
                id={`address-option-${index}`}
                role="option"
                aria-selected={index === highlightIndex}
                className={cn(
                  "flex cursor-pointer items-start gap-2 rounded-sm px-2 py-1.5",
                  index === highlightIndex
                    ? "bg-muted text-foreground"
                    : "text-foreground",
                )}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setHighlightIndex(index)}
              >
                <MapPinIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <span className="line-clamp-2">{result.displayName}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
