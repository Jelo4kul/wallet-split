'use client';

import {  useAccount, useConnect, useEnsName, useNetwork, useDisconnect  } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { socialConnector } from '@/components/WagmiWrapper';
import { useState } from 'react';

export default function Home() {


 // if (isConnected) return <div>Connected to {ensName ?? address}</div>
 return (
  <p>Account Abstraction using Zerodev and Rainbowkit</p>
)
}
