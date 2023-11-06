'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './nav.module.css';
import { usePathname } from 'next/navigation';
import CustomRainbowkitBtn from '../rainbowkit/rainbowkit-connect-button';
import { ECDSAProvider, getRPCProviderOwner } from '@zerodev/sdk'
import { useAccount } from 'wagmi';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import GetStartedButton from '../getStartedButton/getStartedButton';

const NavBar = () => {

  const [ swAddress, setAddress] = useState("loading...");
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false)
  const pathname = usePathname();
  const { saveSmartWalletAddress } = useContainer(Global);

  useEffect(() => {
    setLoading(true);
    const createWallet = async () => {
      try {
          const ecdsaProvider = await ECDSAProvider.init({
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID_SEPOLIA,
          owner: getRPCProviderOwner(window.ethereum),
        })
        let swAddress = await ecdsaProvider.getAddress()
        setAddress(swAddress)
        saveSmartWalletAddress(swAddress);
        setLoading(false);
      } catch(error) {
        console.log(error)
      }
    }
    createWallet();
  }, [address])
  


  const paths = {
    "/":  <GetStartedButton isConnected={isConnected} />,
    "/createWallet": <button>Create Wallet</button>
  }

  const btnText = paths[pathname] ?? <CustomRainbowkitBtn swAddress={loading ? "loading..." : swAddress} />

  return (
    <nav className={styles.NavBar}>
        <Link className={styles.logo} href="/">WalletSplit</Link>
        <div className={styles.center_info}>
            <p>How it works</p>
        </div>
        <div className={styles.auth}>
            {btnText}
        </div>
    </nav>
  )
}

export default NavBar