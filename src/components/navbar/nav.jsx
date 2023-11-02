'use client';
import React from 'react';
import Link from 'next/link';
import styles from './nav.module.css';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NavBar = () => {

  const pathname = usePathname();

  const paths = {
    "/":  <button>Get Started</button>,
    "/createWallet": <button>Create Wallet</button>
  }

  const btnText = paths[pathname] ?? <ConnectButton />

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