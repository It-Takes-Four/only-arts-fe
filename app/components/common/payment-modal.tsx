import { motion } from "framer-motion";
import { useState } from 'react';
import { usePayment } from '../hooks/usePayment';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, X } from "lucide-react";
import { Button } from "./button";
import { Label } from "@/components/ui/label";
import { useAuth } from "../hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import type { Artist } from "../core/_models";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (collection: any) => void;
    collectionId: string;
    collectionName: string;
    collectionImageUrl: string;
    collectionPrice: string;
    artistName: string;
    artistWalletAddress: string;
}

export function PaymentModal({ collectionId, collectionName, collectionImageUrl, collectionPrice, artistName, artistWalletAddress, isOpen, onClose, onSuccess }: PaymentModalProps) {
    const { paymentStatus, purchaseCollection } = usePayment()
    const [isPaying, setisPaying] = useState(false)

    const dummyCollectionId = "3985c408-cac7-4dd1-84c9-7ed35428e402"
    const testingWalletAddress = "0xe39a19f4339A808B0Cd4e60CB98aC565698467FB"

    const handleClose = () => {
        onClose()
    }

    const handlePurchaseCollection = () => {
        purchaseCollection(dummyCollectionId, testingWalletAddress)
        setisPaying(true)
    }

    return (
        <>
            {isOpen &&
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative z-10 w-full max-w-xl mx-4"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <Card className="bg-background/95 backdrop-blur-sm border-border/50">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle>Purchase Summary</CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClose}
                                        disabled={isPaying}
                                        className="h-8 w-8 p-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                    <div className="w-full aspect-[16/9]">
                                        <img className="w-full h-full object-cover rounded-sm" src={collectionImageUrl ? collectionImageUrl : '/profile-background.jpg'} />
                                    </div>
                                    <div className="mt-4 flex flex-col">
                                        <p className="text-3xl font-bold">{collectionName}</p>
                                        <div className="flex justify-between">
                                            <p className="text-muted-foreground">by {artistName}</p>
                                            <p className="font-bold">{collectionPrice} ETH</p>
                                        </div>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handlePurchaseCollection} className="space-y-2">
                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-4">
                                            <Button
                                                type="button"
                                                size="default"
                                                variant="secondary"
                                                onClick={handleClose}
                                                disabled={isPaying}
                                                className="flex-1 bg-transparent"
                                                >
                                                Cancel
                                            </Button>
                                            <Button type="submit" size="default" disabled={isPaying} className="flex-[2]">
                                                {isPaying ? paymentStatus : "Purchase Collection"}
                                            </Button>
                                        </div>
                                    </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            }
        </>
    )
}
