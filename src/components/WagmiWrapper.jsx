'use client';

import { configureChains, mainnet, WagmiConfig, createConfig, } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { SocialWalletConnector } from '@zerodev/wagmi';
import React from 'react';
import Global from '@/state/global';

let socialConnector;

const WagmiWrapper = ({ children }) => {

  const { chains, publicClient, webSocketPublicClient } = configureChains(
        [mainnet],
        [publicProvider()],
  );

  const config = createConfig({
    autoConnect: false,
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
        {children}
      </WagmiConfig>
    </Global.Provider>
 
  )
}

export { socialConnector };
export default WagmiWrapper;






