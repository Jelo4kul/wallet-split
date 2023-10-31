import React from 'react';
import Link from 'next/link';
import styles from './nav.module.css';

const NavBar = () => {
    
  return (
    <nav className={styles.NavBar}>
        <Link className={styles.logo} href="/">WalletSplit</Link>
        <div className={styles.center_info}>
            <p>How it works</p>
        </div>
        <div className={styles.auth}>
            <button>Get Started</button>
        </div>
    </nav>
  )
}

export default NavBar