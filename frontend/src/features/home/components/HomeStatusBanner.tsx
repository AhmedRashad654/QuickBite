import { AlertCircle, Info, MapPinned } from "lucide-react";

export type HomeStatus =
  | "missing-location"
  | "location-denied"
  | "location-unavailable"
  | "fallback"
  | "empty"
  | "loading"
  | "ready";

type HomeStatusBannerProps = {
  status: HomeStatus;
};

const STATUS_COPY = {
  "missing-location": {
    icon: MapPinned,
    title: "Address not specified",
    description: "Choose your area or allow location access to see restaurants near you.",
  },
  "location-denied": {
    icon: AlertCircle,
    title: "Location permission was denied",
    description: "Choose an area manually so we can show restaurants around that location.",
  },
  "location-unavailable": {
    icon: AlertCircle,
    title: "Location is unavailable",
    description: "Your browser could not provide your location. Choose an area manually.",
  },
  fallback: {
    icon: Info,
    title: "Showing nearby restaurants outside your delivery area",
    description:
      "No active restaurant delivers directly to this address, so these are the closest options.",
  },
  empty: {
    icon: AlertCircle,
    title: "No restaurants found",
    description: "Try another area or use your current location.",
  },
  loading: {
    icon: MapPinned,
    title: "Finding restaurants near you",
    description: "We are checking active branches around your selected location.",
  },
  ready: {
    icon: Info,
    title: "Restaurants delivering to your area",
    description: "These active branches are inside the current delivery radius.",
  },
} satisfies Record<HomeStatus, { icon: typeof Info; title: string; description: string }>;

const HomeStatusBanner = ({ status }: HomeStatusBannerProps) => {
  const copy = STATUS_COPY[status];
  const Icon = copy.icon;

  return (
    <div className="flex gap-3 rounded-lg border bg-muted/40 p-4">
      <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium">{copy.title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy.description}</p>
      </div>
    </div>
  );
};

export default HomeStatusBanner;
