'use client';

import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link';

import {  useAccount, useConnect, useEnsName, useNetwork, useDisconnect  } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { socialConnector } from '@/components/WagmiWrapper';
import { useState } from 'react';


export default function Home() {

 return (
   <div className={styles.Home}>
     <section className={styles.Home_Left}>
        <h1>Manage your wallets better</h1>
        <p className={styles.sub_heading}>Split your wallet into mini sub-wallets and allocate a portion of your entire balance for each sub-wallet</p>
        <Link href='/createWallet'>Get Started</Link>
        <div></div>
     </section>
     <section className={styles.Home_Right}>
        <p className={styles.heading}>Transform your wallet</p>
        <div className={styles.content}>
          <section className={styles.Home_Right_left}>
            <p className={styles.right_subHeading}>From this</p>
            <div className={styles.dummyLine}></div>
            <div className={styles.walletBalance}>
              <p className={styles.value}>$1,000</p>
              <p>Wallet Balance</p>
            </div>
          </section>
          <Image 
            src="/forward-arrow.svg"
            width={40}
            height={40}
            alt="split arrow"
            className={styles.splitArrow}
          />
          <section className={styles.Home_Right_right}>
            <p className={styles.right_subHeading}>To this</p>
            <div className={styles.dummyLine}></div>
            <section>
              <div className={styles.allocations}>
                <p  className={styles.splittedValue}>$300</p>
                <p>Family and Friends Balance</p>
              </div>
              <div className={styles.allocations}>
                <p  className={styles.splittedValue}>$500</p>
                <p>Miscellaneous Expenses Balance</p>
              </div>
              <div className={styles.allocations}>
                <p  className={styles.splittedValue}>$200</p>
                <p>NFTs Balance</p>
              </div>
            </section>
          </section>
        </div>
      
     </section>
   </div>

)
}
