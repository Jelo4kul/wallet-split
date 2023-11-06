'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { createPublicClient, http, formatEther } from 'viem';
import { sepolia } from 'viem/chains';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import { validatorABI, validatorAddress } from '@/constants/constants';
import { useAccount } from 'wagmi';


const Dashboard = () => {

const [balance, setbalance] = useState('0');

const transport = http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
const publicClient = createPublicClient({
    chain: sepolia,
    transport,
});

const { allocations, setAllocationData, address: swAddress  } = useContainer(Global);

useEffect(() => {
    const getSmartWalletBalance = async () => {
        let bal = await publicClient.getBalance({address: swAddress});
        setbalance(formatEther(bal+''));

        const allocs = await publicClient.readContract({
            address: validatorAddress,
            abi: validatorABI,
            functionName: 'getAllocations',
            args: [swAddress]
        })
        setAllocationData(
            {
                fnf: formatEther(allocs[2]),
                nfts: formatEther(allocs[3]),
                miscellaneous: formatEther(allocs[4]),
            }
        )
    }
    getSmartWalletBalance();
}, []);

  return (
    <div className={styles.dashboard}>
        <p className={styles.welcomeMsg}>Hi, <span>Friend!</span></p>
        <section className={styles.totalWalletBalanceContainer}>
            <p className={styles.totWalletLabel}>Total Wallet Balance</p>
            <p className={styles.totWalletValue}>{balance}<span>ETH</span></p>
            <div className={styles.actions}>
                <div className={styles.actionsBox}>
                    <Image 
                        src="/deposit.svg"
                        width={20}
                        height={20}
                        alt="Deposit"
                    /> 
                    <p className={styles.actionLabel}>Deposit</p>
                </div>
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
        <section className={styles.subWalletSection}>
            <p className={styles.subWalletLabel}>Your sub wallets</p>
            <section className={styles.subWalletLayout}>
                <div className={styles.subWalletContainer}>
                    <Image 
                        src="/fnf.svg"
                        width={20}
                        height={20}
                        alt="Family and Friends"
                    />
                    <p className={styles.subWalletTag}>Family and Friends</p>
                    <p className={styles.subWalletValue}>{allocations.fnf}<span>ETH</span></p>
                </div>
                <div className={styles.subWalletContainer}>
                    <Image 
                        src="/miscellaneous.svg"
                        width={20}
                        height={20}
                        alt="Miscellaneous"
                    />
                    <p className={styles.subWalletTag}>Miscellaneous</p>
                    <p className={styles.subWalletValue}>{allocations.miscellaneous}<span>ETH</span></p>
                </div>
                <div className={styles.subWalletContainer}>
                    <Image 
                        src="/nfts.svg"
                        width={20}
                        height={20}
                        alt="NFTs"
                    />
                    <p className={styles.subWalletTag}>NFTs</p>
                    <p className={styles.subWalletValue}>{allocations.nfts}<span>ETH</span></p>
                </div>
            </section>
        </section>
        {/* <section>
            <p>Your Transactions</p>
        </section> */}
    </div>
  )
}

export default Dashboard