import { artCollectionsService } from 'app/services/art-collections-service';
import { ethers } from 'ethers'
import { useState } from 'react';
import { usePayment } from '../hooks/usePayment';

interface PaymentModalProps {
    collectionId: string;
    artistWalletAddress: string;
}

export function PaymentModal({ collectionId, artistWalletAddress }: PaymentModalProps) {
    const TARGET_CHAIN_ID = import.meta.env.TARGET_CHAIN_ID
    const { paymentStatus, purchaseCollection } = usePayment()
    const [isPaying, setisPaying] = useState(false)

    const dummyCollectionId = "023e6b5a-75aa-47af-94e1-04385ab3e219"
    const testingWalletAddress = "0xe39a19f4339A808B0Cd4e60CB98aC565698467FB"

    // const artistWalletAddress = "0xe774cd104A03ba1B401403A9Eb7B0778279c043F" // ko KE
    // const artistWalletAddress = "0xe39a19f4339A808B0Cd4e60CB98aC565698467FB" // Cathh

    return (
        <>
            <button className='bg-primary px-4 py-2 rounded-md' onClick={() => purchaseCollection(dummyCollectionId, testingWalletAddress)}>{isPaying ? paymentStatus : "Purchase Collection"}</button>
        </>
    )
}
