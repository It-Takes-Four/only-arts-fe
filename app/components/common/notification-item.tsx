import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./button";

interface NotificationItemProps {
    index: number
    id: string
    title: string
    content: string
    time: Date
}

function formatTimePassed(date: Date): string {
    const now = Date.now();
    const diff = now - date.getTime(); // in ms

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (seconds < 60) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function NotificationItem({ id, content, time, title, index }: NotificationItemProps) {
    return (
        <>
            <motion.div
                key={id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    delay: 0.1 + index * 0.05,
                    duration: 0.3,
                    ease: "easeOut",
                }}
                whileHover={{
                    backgroundColor: "bg-red",
                    transition: { duration: 0.15 },
                }}
                className={`p-3 border-b border-muted transition-colors ${index === 2 ? "border-b-0" : ""}`}
            >
                <div className="flex gap-2">
                    <div className="flex flex-col gap-1 w-full">
                        <p className="text-xs text-foreground text-left">{content}</p>
                        <p className="text-xs text-muted-foreground text-left">{formatTimePassed(time)}</p>
                    </div>
                    <Button
                        variant="ghost"
                        className="hover:text-foreground p-1 ml-auto"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </motion.div>
        </>
    )
}