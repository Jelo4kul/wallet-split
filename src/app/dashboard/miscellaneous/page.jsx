'use client';
import Image from 'next/image';
import React from 'react';
import styles from './page.module.css';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';

const Miscellaneous = () => {

 const { allocations, setAllocationData } = useContainer(Global);
  return (
    <div className={styles.miscellaneous}>
        <p className={styles.title}>Miscellaneous</p>
        <p className={styles.subTitle}>You can send money to any address not in your family and friends address book</p>
        <section className={styles.miscBalanceContainer}>
            <p className={styles.miscWalletLabel}>Miscellaneous Balance</p>
            <p className={styles.miscWalletValue}>{allocations.miscellaneous}<span>ETH</span></p>
            <div className={styles.actions}>
                <div className={styles.actionsBox}>
                    <Image 
                        src="/send.svg"
                        width={20}
                        height={20}
                        alt="Send"
                    /> 
                    <p className={styles.actionLabel}>Send</p>
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

export default Miscellaneous