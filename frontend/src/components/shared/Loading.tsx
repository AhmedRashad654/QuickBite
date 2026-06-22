import { Loader2 } from "lucide-react";

const Loading = ({ text }: { text: string }) => {
  return (
    <div className="flex min-h-[80dvh] items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {text || "Loading"}
      </div>
    </div>
  );
};

export default Loading;
