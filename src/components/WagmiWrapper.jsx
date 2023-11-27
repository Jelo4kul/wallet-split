'use client';

import { configureChains, WagmiConfig, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SocialWalletConnector } from '@zerodev/wagmi';
import { googleWallet } from '@zerodev/wagmi/rainbowkit';
import React from 'react';
import Global from '@/state/global';
// RainbowKit
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet
} from '@rainbow-me/rainbowkit/wallets';
import DashboardData from '@/state/dashboard';

let socialConnector;
const WagmiWrapper = ({ children }) => {

  const allowedChains = [sepolia]
  const { chains, publicClient, webSocketPublicClient } = configureChains(
         allowedChains,
        [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }), publicProvider()]
  );

  const connectors = connectorsForWallets([
    {
      groupName: "EOA",
      wallets: [
        metaMaskWallet({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, chains})
      ]
    },
    {
      groupName: 'Social',
      wallets: [
        googleWallet({chains, options: { projectId: process.env.NEXT_PUBLIC_PROJECT_ID_SEPOLIA }}),
      ],
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
      <DashboardData.Provider>
        <WagmiConfig config={config}>
          <RainbowKitProvider chains={chains} modalSize={'compact'}>
          {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </DashboardData.Provider>
    </Global.Provider>
 
  )
}

export { socialConnector };
export default WagmiWrapper;






