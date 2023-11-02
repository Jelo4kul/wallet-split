'use client';
import Image from 'next/image';
import React from 'react';
import styles from './page.module.css';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';

const FamilyAndFriends = () => {

  const { allocations, setAllocationData } = useContainer(Global);

  return (
    <div className={styles.fnf}>
        <p className={styles.title}>Famiy and Friends</p>
        <p>Send money to any address in your family and friends address book</p>
        <section className={styles.fnfBalanceContainer}>
            <p className={styles.fnfWalletLabel}>Family and Friends Balance</p>
            <p className={styles.fnfWalletValue}>{allocations.fnf}<span>ETH</span></p>
            <div className={styles.actions}>
                <div>
                    <Image 
                        src="/send.svg"
                        width={20}
                        height={20}
                        alt="Send"
                    /> 
                    <p>Send</p>
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

export default FamilyAndFriends