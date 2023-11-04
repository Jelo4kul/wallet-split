'use client';

import { configureChains, WagmiConfig, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SocialWalletConnector } from '@zerodev/wagmi';
import React from 'react';
import Global from '@/state/global';
// RainbowKit
import { connectorsForWallets, RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { enhanceWalletWithAAConnector } from '@zerodev/wagmi/rainbowkit';

let socialConnector;
//NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
const WagmiWrapper = ({ children }) => {


  const { chains, publicClient, webSocketPublicClient } = configureChains(
        [sepolia],
        [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }), publicProvider()]
  );

  const { wallets } = getDefaultWallets({
    appName: 'Wallet split',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    chains,
  });

  const connectors = connectorsForWallets([
    //Tip: including the wallets object is important, if not you won'y be able to programmatically switch networks from your app
    ...wallets,
    {
      groupName: "EOA wrapped with AA",
      wallets: [
       enhanceWalletWithAAConnector(
          metaMaskWallet({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, chains }),
         { projectId: process.env.NEXT_PUBLIC_PROJECT_ID_SEPOLIA}
        )
      ]
    },
    {
      groupName: "EOA",
      wallets: [
        rainbowWallet({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, chains})
      ]
    },
  ])

  const config = createConfig({
    //setting autoConnect to true saves the owner's address and signIn details to the local storage
    //this way, when you refresh the site, your last connection still persists. 
    //This means you'll still be logged in not logged out
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });

  socialConnector = new SocialWalletConnector({chains, options: {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID_SEPOLIA,
  }});

  return (
    // Wrap in global state provider (at layout level)
    <Global.Provider>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains} modalSize={'compact'}>
         {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </Global.Provider>
 
  )
}

export { socialConnector };
export default WagmiWrapper;






