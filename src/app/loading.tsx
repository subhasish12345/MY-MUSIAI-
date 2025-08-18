
import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <LoaderCircle className="h-16 w-16 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
