'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import styles from './page.module.css';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import DepositModal from '@/components/depositModal/depositModal';


const Dashboard = () => {

    const [isDepositClicked, setisDepositClicked] = useState(false);
    const { allocations,  balance, address: swAddress  } = useContainer(Global);
    const handleDepositClicked = () => {
        // if(!isConnected) {
        //   openConnectModal();
        // } else {
        setisDepositClicked(true)
        //}
    };

    const handleOverlayClicked = (event) => {
        //here we are using event delegation to prevent the child element from closing the modal.
        //The modal should only be closed by clicking the parent element
        //In summary we want to activate the onClick event on the parent and not the child element
        //event.target returns the parent element. event.currentTarget returns the exact child element that was clicked.
        if(event.target ==  event.currentTarget){
        closeModal();
        }
    }

    const closeModal = () => {
        setisDepositClicked(false)
    }

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
                    <p onClick={handleDepositClicked} className={styles.actionLabel}>Deposit</p>
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
        <DepositModal 
            isDepositClicked={isDepositClicked} 
            handleOverlayClicked={handleOverlayClicked} 
            closeModal={closeModal} 
            swAddress={swAddress} 
        />
        {/* <section>
            <p>Your Transactions</p>
        </section> */}
    </div>
  )
}

export default Dashboard