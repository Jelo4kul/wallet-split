'use client';

import {  useAccount, useConnect, useEnsName, useNetwork, useDisconnect  } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { socialConnector } from '@/components/WagmiWrapper';
import { useState } from 'react';

export default function Home() {

  const { address, connector, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  //InjectedConnector works for Metamask and other injected web3 wallets in the browser
  // const { connect } = useConnect({
  //   connector: new InjectedConnector(),
  // })
  const [loading, setLoading] = useState(false)
  const { connect, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()

  const connectWallet = async () => {
    setLoading(true);
    await connect({
      connector: socialConnector
    })
    setLoading(false)
  }

  if (isConnected) {
    return (
      <div>
        <div>{address}</div>
        <div>Connected to {connector.name}</div>
        <a href={`${chain?.blockExplorers?.default.url}/address/${address}`} target="_blank">Explorer</a><br />
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )
  }

 // if (isConnected) return <div>Connected to {ensName ?? address}</div>
 return (
  <button disabled={isLoading || loading} onClick={connectWallet}>
    {isLoading || loading ? 'loading...' : 'Connect to Social'}
  </button>
)
}
