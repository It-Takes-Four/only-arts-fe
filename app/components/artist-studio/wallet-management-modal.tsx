import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Button } from "../common/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, Wallet, Eye, EyeOff, Copy, Check, X, Link, Unlink, Info } from "lucide-react";
import { toast } from 'sonner';
import { artistService } from "app/services/artist-service";
import { useArtistStudio } from "app/context/artist-studio-context";

interface WalletManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWalletAddress?: string | null;
}

type FormData = {
  walletAddress: string;
};

// Utility function to validate Ethereum address
const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Utility function to format wallet address for display
const formatWalletAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function WalletManagementModal({ isOpen, onClose, currentWalletAddress }: WalletManagementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [copied, setCopied] = useState(false);
  const { refreshProfile } = useArtistStudio();
  
  // Wagmi hooks for wallet connection
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      walletAddress: currentWalletAddress || "",
    },
  });

  const watchedWalletAddress = watch("walletAddress");

  const handleCopyAddress = async () => {
    if (!currentWalletAddress) return;
    
    try {
      await navigator.clipboard.writeText(currentWalletAddress);
      setCopied(true);
      toast.success('Wallet address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  const handleConnectWallet = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  const handleDisconnectWallet = () => {
    disconnect();
    toast.success('Wallet disconnected');
  };

  const handleUseConnectedWallet = () => {
    if (address) {
      setValue("walletAddress", address);
      toast.success('Connected wallet address added to form');
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!data.walletAddress.trim()) {
      toast.error("Please enter a wallet address");
      return;
    }

    if (!isValidEthereumAddress(data.walletAddress.trim())) {
      toast.error("Please enter a valid Ethereum wallet address");
      return;
    }

    setIsSubmitting(true);
    try {
      await artistService.updateWalletAddress(data.walletAddress.trim());
      
      // Refresh all artist data
      await refreshProfile();
      
      toast.success("Wallet address updated successfully!");
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update wallet address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setShowFullAddress(false);
    setCopied(false);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div className="relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-lg border m-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  Wallet Management
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your cryptocurrency wallet address
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Current Wallet Address */}
                {currentWalletAddress && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Current Wallet Address</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                      <div className="flex-1 min-w-0 font-mono text-sm break-all">
                        {showFullAddress ? currentWalletAddress : formatWalletAddress(currentWalletAddress)}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowFullAddress(!showFullAddress)}
                          className="h-8 w-8 p-0"
                        >
                          {showFullAddress ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyAddress}
                          className="h-8 w-8 p-0"
                          disabled={copied}
                        >
                          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wallet Connection Section */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Connect Wallet (Recommended)</Label>
                  
                  {isConnected && address ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Wallet Connected
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-300 font-mono break-all">
                            {address}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleUseConnectedWallet}
                            className="text-xs h-8"
                            disabled={watchedWalletAddress === address}
                          >
                            {watchedWalletAddress === address ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Used
                              </>
                            ) : (
                              <>
                                <Link className="h-3 w-3 mr-1" />
                                Use
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDisconnectWallet}
                            className="text-xs h-8"
                          >
                            <Unlink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleConnectWallet}
                      className="w-full"
                      disabled={!openConnectModal}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </Button>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Connect your wallet to automatically fill in your address and verify ownership.
                  </p>
                </div>

                <Separator />

                {/* Update Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletAddress" className="text-sm font-medium">
                      {currentWalletAddress ? 'New Wallet Address' : 'Wallet Address'}
                    </Label>
                    <div className="relative">
                      <Input
                        id="walletAddress"
                        type="text"
                        placeholder="0x742d35Cc6C6C5f10C0d0a6b5b4e5c5e5a5d5c5e5"
                        className="font-mono text-sm pr-10"
                        {...register("walletAddress", {
                          required: "Wallet address is required",
                          validate: (value) => {
                            if (!value.trim()) return "Wallet address is required";
                            if (!isValidEthereumAddress(value.trim())) {
                              return "Please enter a valid Ethereum wallet address (0x followed by 40 hexadecimal characters)";
                            }
                            return true;
                          },
                        })}
                        disabled={isSubmitting}
                      />
                      {watchedWalletAddress && isConnected && address === watchedWalletAddress && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <Check className="h-4 w-4" />
                            <span className="text-xs">Connected</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.walletAddress && (
                      <Alert variant="destructive">
                        <AlertDescription className="text-sm">
                          {errors.walletAddress.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>• Enter a valid Ethereum wallet address starting with "0x"</p>
                    <p>• Use the "Connect Wallet" button above for automatic address filling</p>
                    <p>• This will be used for receiving payments and NFT transactions</p>
                    <p>• Make sure you own this wallet address</p>
                  </div>

                  {/* Security Info */}
                  <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">Security Tips:</p>
                      <p>• Connecting your wallet verifies ownership and auto-fills the address</p>
                      <p>• Never share your private keys or seed phrase</p>
                      <p>• Double-check the address before saving</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        `${currentWalletAddress ? 'Update' : 'Add'} Wallet`
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
