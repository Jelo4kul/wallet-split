'use client';
import React from 'react';
import Link from 'next/link';
import styles from './nav.module.css';
import { usePathname } from 'next/navigation';

const NavBar = () => {

  const pathname = usePathname();

  const paths = {
    "/": "Get Started",
    "/createWallet": "Create Wallet"
  }

  const btnText = paths[pathname] ?? "Connect Wallet"

  return (
    <nav className={styles.NavBar}>
        <Link className={styles.logo} href="/">WalletSplit</Link>
        <div className={styles.center_info}>
            <p>How it works</p>
        </div>
        <div className={styles.auth}>
            <button>{btnText}</button>
        </div>
    </nav>
  )
}

export default NavBar