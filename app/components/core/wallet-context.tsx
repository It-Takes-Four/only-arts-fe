import React, { createContext, useContext, type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
// import { wagmiConfig } from '../../lib/wagmi-config';
import { useTheme } from './theme-context';

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const { theme } = useTheme();

  return (
    // <WagmiProvider config={wagmiConfig}>
    //   <RainbowKitProvider 
    //     theme={theme === 'dark' ? darkTheme() : lightTheme()}
    //     showRecentTransactions={true}
    //   >
    //     {children}
    //   </RainbowKitProvider>
    // </WagmiProvider>
    <></>
  );
}
