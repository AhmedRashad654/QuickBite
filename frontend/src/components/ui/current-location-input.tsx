import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderIcon, MapPinIcon } from "lucide-react";
import type { GeocodeResult } from "@/hooks/useGeocode";

interface CurrentLocationInputProps {
  onSelect: (result: GeocodeResult) => void;
  className?: string;
}

interface NominatimReverseAddress {
  road?: string;
  house_number?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  country?: string;
  country_code?: string;
}

interface NominatimReverseResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimReverseAddress;
}

const CurrentLocationInput = ({
  onSelect,
  className,
}: CurrentLocationInputProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
            {
              headers: {
                "User-Agent": "QuickBiteApp/1.0",
                "Accept-Language": "en",
              },
            },
          );

          if (!response.ok) {
            throw new Error(
              `Reverse geocoding request failed (${response.status})`,
            );
          }

          const data: NominatimReverseResult = await response.json();

          const result: GeocodeResult = {
            lat,
            lng,
            displayName: data.display_name,
            country: data.address?.country,
            countryCode: data.address?.country_code,
            city:
              data.address?.city ??
              data.address?.town ??
              data.address?.village ??
              data.address?.municipality,
            street: data.address?.road
              ? [data.address?.house_number, data.address?.road]
                  .filter(Boolean)
                  .join(" ")
              : undefined,
          };

          setSelectedAddress(data.display_name);
          onSelect(result);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to get address",
          );
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location access is blocked. Please enable it in your browser settings and refresh the page."
            : "Failed to retrieve your location. Please try again.",
        );
        setIsLoading(false);
      },
    );
  }, [onSelect]);

  return (
    <div className={cn("col-span-2", className)}>
      <Button
        type="button"
        variant="outline"
        onClick={getCurrentLocation}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <LoaderIcon className="size-4 animate-spin" />
            Getting your location...
          </>
        ) : (
          <>
            <MapPinIcon className="size-4" />
            Use Current Location
          </>
        )}
      </Button>
      {error ? (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      ) : null}
      {selectedAddress ? (
        <div className="mt-2 flex items-start gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm">
          <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span className="line-clamp-2 text-foreground">
            {selectedAddress}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default CurrentLocationInput;
