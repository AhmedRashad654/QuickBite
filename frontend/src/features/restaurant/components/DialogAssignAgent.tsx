import { useState, useEffect, useRef } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useDeliveryAgentSearch,
  useAssignOrderExhausted,
} from "../hooks/restaurant-hooks";
import { Loader2, User } from "lucide-react";

interface DialogAssignAgentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderPublicId: string | null;
}

const DialogAssignAgent = ({
  open,
  onOpenChange,
  orderPublicId,
}: DialogAssignAgentProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const prevOpenRef = useRef(open);
  const assign = useAssignOrderExhausted();
  const { data: agents, isLoading } = useDeliveryAgentSearch(debouncedQuery);

  useEffect(() => {
    if (!prevOpenRef.current && open) {
      setQuery("");
      setDebouncedQuery("");
    }
    prevOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const handleSelect = (agentId: number) => {
    if (!orderPublicId) return;
    assign.mutate(
      { publicId: orderPublicId, agentId },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Assign Delivery Agent</DialogTitle>
          <DialogDescription>
            Search for a delivery agent to assign this order
          </DialogDescription>
        </DialogHeader>

        <Command className="rounded-lg border-none">
          <CommandInput
            placeholder="Search by name, phone, or email..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {!isLoading && (
              <CommandEmpty>No delivery agents found</CommandEmpty>
            )}
            {agents && agents.length > 0 && (
              <CommandGroup heading="Delivery Agents">
                {agents.map((agent) => (
                  <CommandItem
                    key={agent.id}
                    value={`${agent.name} ${agent.email} ${agent.phone ?? ""}`}
                    onSelect={() => handleSelect(agent.id)}
                    disabled={assign.isPending}
                  >
                    <User className="size-4 shrink-0" />
                    <div className="flex flex-col">
                      <span>{agent.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {agent.email}
                        {agent.phone ? ` · ${agent.phone}` : ""}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAssignAgent;
