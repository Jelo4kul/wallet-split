'use client';
import Image from 'next/image';
import React from 'react';
import styles from './page.module.css';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';

const NFTs = () => {

  const { allocations } = useContainer(Global);

  return (
    <div className={styles.nfts}>
        <p className={styles.title}>NFTs</p>
        <p className={styles.subTitle}>Purchase NFTs from Opensea from your NFT balance</p>
        <section className={styles.nftBalanceContainer}>
            <p className={styles.nftWalletLabel}>NFT Balance</p>
            <p className={styles.nftWalletValue}>{allocations.nfts}<span>ETH</span></p>
            <div className={styles.actions}>
                <div className={styles.actionsBox}>
                    <Image 
                        src="/nfts.svg"
                        width={20}
                        height={20}
                        alt="Send"
                    /> 
                    <p className={styles.actionLabel}>Purchase Nft</p>
                </div>
                <div className={styles.actionsBox}>
                    <Image 
                        src="/update.svg"
                        width={20}
                        height={20}
                        alt="Update"
                    /> 
                    <p className={styles.actionLabel}>Update</p>
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