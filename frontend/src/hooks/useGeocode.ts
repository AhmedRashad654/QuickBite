import { useState, useEffect, useRef } from "react";

interface NominatimAddress {
  road?: string;
  house_number?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  country?: string;
  country_code?: string;
  postcode?: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
  city?: string;
  street?: string;
  country?: string;
  countryCode?: string;
}

interface UseGeocodeReturn {
  results: GeocodeResult[];
  isLoading: boolean;
  error: string | null;
}

export function useGeocode(query: string, debounceMs = 1000): UseGeocodeReturn {
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 3) {
      const timeoutId = setTimeout(() => {
        setResults([]);
        setError(null);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=json&limit=5&addressdetails=1&countrycodes=eg,sa`,
          {
            signal: controller.signal,
            headers: {
              "User-Agent": "QuickBiteApp/1.0",
              "Accept-Language": "en",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Geocoding request failed (${response.status})`);
        }

        const data: NominatimResult[] = await response.json();
        setResults(
          data.map((item) => ({
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            displayName: item.display_name,
            country: item.address?.country,
            countryCode: item.address?.country_code,
            city:
              item.address?.city ??
              item.address?.town ??
              item.address?.village ??
              item.address?.municipality,
            street:
              item.address?.road
                ? [
                    item.address?.house_number,
                    item.address?.road,
                  ]
                    .filter(Boolean)
                    .join(" ")
                : undefined,
          })),
        );
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Geocoding failed");
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [query, debounceMs]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return { results, isLoading, error };
}
