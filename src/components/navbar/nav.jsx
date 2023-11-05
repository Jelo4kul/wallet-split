'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './nav.module.css';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import CustomRainbowkitBtn from '../rainbowkit/rainbowkit-connect-button';
import { ECDSAProvider, getRPCProviderOwner } from '@zerodev/sdk'
import { useAccount } from 'wagmi';

const NavBar = () => {

  const [ swAddress, setAddress] = useState("loading...");
  const { address } = useAccount();
  const [loading, setLoading] = useState(false)
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const createWallet = async () => {
      try {
          const ecdsaProvider = await ECDSAProvider.init({
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID_SEPOLIA,
          owner: getRPCProviderOwner(window.ethereum),
        })
        setAddress(await ecdsaProvider.getAddress())
        setLoading(false);
      } catch(error) {
        console.log(error)
      }
    }
    createWallet();
  }, [address])
  


  const paths = {
    "/":  <button>Get Started</button>,
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