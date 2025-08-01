import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, X } from "lucide-react";
import { useState } from "react";
import { NotificationItem } from "./notification-item";

interface NotificationDropdownProps {
    isOpen: boolean;
}

export function NotificationDropdown({ isOpen }: NotificationDropdownProps) {
    

    const dummyNotificationData = [
        {
            id: "lskdjflasdjfsdf",
            title: "New message received",
            content: "John sent you a message",
            time: new Date(Date.now()),
        },
        {
            id: "sfkhefwehif",
            title: "Task completed",
            content: "Your report has been processed",
            time: new Date(Date.now()),
        },
        {
            id: "askdjhakjdw",
            title: "System update",
            content: "New features are now available",
            time: new Date(Date.now()),
        },
    ]

    return (
        <div className="relative">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scaleY: 0, y: -10 }}
                        animate={{ opacity: 1, scaleY: 1, y: 0 }}
                        exit={{ opacity: 0, scaleY: 0, y: -10 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.4, 0.0, 0.2, 1],
                            scaleY: { duration: 0.25 },
                            opacity: { duration: 0.2 },
                        }}
                        style={{ originY: 0 }} // Transform origin at top
                        className="absolute -right-2 top-5 w-80 bg-background border border-border rounded-lg shadow-lg z-50"
                    >
                        <div className="max-h-96 overflow-y-auto">
                            {dummyNotificationData.map((notification, index) => (
                                <NotificationItem content={notification.content} id={notification.id} index={index} time={notification.time} title={notification.title} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}