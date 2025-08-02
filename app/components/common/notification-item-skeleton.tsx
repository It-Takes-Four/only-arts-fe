import { Skeleton } from "@/components/ui/skeleton";

export function NotificationItemSkeleton() {
    return (
        <>
            <div className="w-full p-3 border-b border-muted flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        </>
    )
}