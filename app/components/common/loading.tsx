import { Loader2 } from "lucide-react";

export const Loading = () => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-xl flex flex-col items-center border border-border">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold text-foreground">Processing data...</p>
          </div>
        </div>
    )
}