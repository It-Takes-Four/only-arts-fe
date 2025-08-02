import { useState } from "react";
import { usePayment } from "../hooks/usePayment";
import { Button } from "./button";
import { getCurrencySymbol } from "../../utils/currency";

interface PaymentButtonProps {
    collectionId: string;
    artistWalletAddress: string;
}
export function PaymentButton({ collectionId, artistWalletAddress }: PaymentButtonProps) {
    const { paymentStatus, purchaseCollection } = usePayment()
    const [isPaying, setisPaying] = useState(false)

    const handlePurchaseCollection = () => {
        purchaseCollection(collectionId, artistWalletAddress)
        setisPaying(true)
    }

    return (
        <Button type="button" size="default" disabled={isPaying} onClick={() => { handlePurchaseCollection() }}>
            {isPaying ? paymentStatus : `Purchase Collection (${getCurrencySymbol()})`}
        </Button>
    )
}