# Wallet Integration Documentation

## Overview
This implementation adds comprehensive wallet linking functionality to the OnlyArts frontend using wagmi and RainbowKit.

## Features Implemented

### 1. Wallet Connection
- Uses RainbowKit for wallet connection UI
- Supports multiple chains: Mainnet, Sepolia, Polygon, Optimism, Arbitrum, Base
- Responsive design with theme support (light/dark)

### 2. Wallet Linking Service
- `WalletService` class for backend API communication
- Endpoints for linking, unlinking, and managing wallets
- Signature verification workflow

### 3. Components

#### WalletProvider
- Wraps the app with wagmi and RainbowKit providers
- Integrates with existing theme system

#### WalletLinkComponent
- Complete UI for wallet connection and management
- Shows connected wallet status
- Lists linked wallets with unlink functionality
- Loading states and error handling

#### useWalletLink Hook
- Custom hook for wallet linking logic
- Handles message signing and verification
- Manages linked wallets state

### 4. Backend API Expectations

The implementation expects these backend endpoints:

```typescript
// Get verification message for wallet
POST /api/v1/wallets/verify-ownership
Body: { walletAddress: string }
Response: { message: string }

// Link wallet with signature
POST /api/v1/wallets/link
Body: {
  walletAddress: string,
  signature: string,
  message: string
}
Response: {
  id: string,
  userId: string,
  walletAddress: string,
  isVerified: boolean,
  linkedAt: string
}

// Get linked wallets
GET /api/v1/wallets/linked
Response: WalletLinkResponse[]

// Unlink wallet
DELETE /api/v1/wallets/unlink/:walletAddress
Response: { success: boolean, message: string }
```

### 5. Environment Variables

Add to your `.env` file:
```
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get your project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

### 6. Usage in Dev Test Page

The dev test page now includes:
- Wallet connection interface
- Link/unlink wallet functionality
- Linked wallets display
- Testing buttons for wallet service calls
- Debug functionality

### 7. Security Features

- Message signing for ownership verification
- Server-side signature validation
- JWT authentication for wallet management
- Secure unlinking with user authorization

### 8. Type Safety

- Full TypeScript support
- Type definitions for all wallet-related interfaces
- Integration with existing User model

## Testing

Visit `/dev-test` to test wallet functionality:
1. Connect your wallet using the RainbowKit interface
2. Click "Link Wallet" to associate it with your account
3. View linked wallets in the list below
4. Use test buttons to verify service integration
5. Unlink wallets when needed

## Future Enhancements

- Multi-signature wallet support
- Hardware wallet integration
- Wallet balance display
- Transaction history
- ENS name resolution
- Wallet-based authentication flow
