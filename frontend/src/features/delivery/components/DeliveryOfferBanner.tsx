import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Check, X } from "lucide-react";
import { useAcceptOffer, useRejectOffer } from "../hooks/useDeliveryActions";
import { formatPrice } from "@/lib/format-price";
import type { DeliveryOffer } from "../types";

interface Props {
  offer: DeliveryOffer;
  onDismiss: () => void;
}

export function DeliveryOfferBanner({ offer, onDismiss }: Props) {
  const acceptMutation = useAcceptOffer();
  const rejectMutation = useRejectOffer();
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const diff = Math.floor(
      (new Date(offer.expires_at).getTime() - Date.now()) / 1000,
    );
    return Math.max(0, diff);
  });

  useEffect(() => {
    if (secondsLeft <= 0) {
      onDismiss();
      return;
    }
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft, onDismiss]);

  const handleAccept = useCallback(() => {
    acceptMutation.mutate(offer.order_id, {
      onSuccess: () => onDismiss(),
    });
  }, [acceptMutation, offer.order_id, onDismiss]);

  const handleReject = useCallback(() => {
    rejectMutation.mutate(offer.order_id, {
      onSuccess: () => onDismiss(),
    });
  }, [rejectMutation, offer.order_id, onDismiss]);

  const isPending = acceptMutation.isPending || rejectMutation.isPending;

  return (
    <Card className="border-primary/50 bg-primary/5 shadow-lg">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">New Delivery Offer</span>
            <Badge variant="outline" className="font-mono text-xs">
              #{offer.order_id.slice(-8).toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            <span className={secondsLeft <= 10 ? "font-bold text-destructive" : ""}>
              {secondsLeft}s
            </span>
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-green-600" />
            <div>
              <p className="font-medium">{offer.branch.name || "Branch"}</p>
              <p className="text-muted-foreground">{offer.branch.address_text}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-blue-600" />
            <div>
              <p className="font-medium">Drop-off</p>
              <p className="text-muted-foreground">{offer.dropoff.address_text}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {offer.payment_method === "cod" ? "Cash on Delivery" : "Paid Online"}
          </span>
          <span className="font-semibold">{formatPrice(offer.total, offer.currency)}</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleReject}
            disabled={isPending}
          >
            <X className="mr-1 size-4" />
            Reject
          </Button>
          <Button
            className="flex-1"
            onClick={handleAccept}
            disabled={isPending}
          >
            <Check className="mr-1 size-4" />
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
