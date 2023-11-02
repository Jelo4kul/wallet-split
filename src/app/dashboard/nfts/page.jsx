'use client';
import Image from 'next/image';
import React from 'react';
import styles from './page.module.css';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';

const NFTs = () => {

  const { allocations, setAllocationData } = useContainer(Global);

  return (
    <div className={styles.nfts}>
        <p className={styles.title}>NFTs</p>
        <p>Purchase NFTs from Opensea from your NFT balance</p>
        <section className={styles.nftBalanceContainer}>
            <p className={styles.nftWalletLabel}>NFT Balance</p>
            <p className={styles.nftWalletValue}>{allocations.nfts}<span>ETH</span></p>
            <div className={styles.actions}>
                <div>
                    <Image 
                        src="/nfts.svg"
                        width={20}
                        height={20}
                        alt="Send"
                    /> 
                    <p>Purchase Nft</p>
                </div>
                <div>
                    <Image 
                        src="/update.svg"
                        width={20}
                        height={20}
                        alt="Update"
                    /> 
                    <p>Update</p>
                </div>
            </div>
        </section>
        <section className={styles.transacSec}>
            <p className={styles.recTransacLabel}>Recent Transactions</p>
            <div className={styles.trasancImageBox}>
                <Image 
                    src="/recent-transac.svg"
                    width={200}
                    height={200}
                    alt="Send"
                    className={styles.transacImage}
                /> 
                <p>No recent transations</p>
            </div>
        </section>
    </div>
  )
}

export default NFTs