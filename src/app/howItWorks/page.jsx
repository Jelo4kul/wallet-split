import Image from 'next/image';
import React from 'react';
import styles from './page.module.css';

const HowItWorks = () => {
  return (
    <div className={styles.howItWorks}>
        <h1>How It Works</h1>
        <section className={styles.bottom}>
            <div className={styles.actionContainer}>
                <Image 
                    src="/create.svg"
                    width={190}
                    height={190}
                    alt="create"
                /> 
                 <div>
                    <p className={styles.actionLabel}>Create Wallet</p>
                    <p className={styles.actionExplainerLabel}>Before you experience the full capabilities of wallet split, you have to create a smart wallet </p>
                </div>
            </div>
            <Image 
                    src="/forward-arrow.svg"
                    width={20}
                    height={20}
                    alt="forward arrow"
                    className={styles.forwardArrow}
                /> 
            <div className={styles.actionContainer}>
                <Image 
                    src="/split-wallet.svg"
                    width={190}
                    height={190}
                    alt="Split"
                /> 
                <div>
                    <p className={styles.actionLabel}>Split Wallet</p>
                    <p className={styles.actionExplainerLabel}>After creating a smart wallet, the next step to take is to split your wallet into mini-wallets. Each mini-wallet acts on its own and have a specific purpose.</p>
                </div>
            </div>
            <Image 
                    src="/forward-arrow.svg"
                    width={20}
                    height={20}
                    alt="forward arrow"
                    className={styles.forwardArrow}
                /> 
            <div className={styles.actionContainer}>
                <Image 
                    src="/spend.svg"
                    width={190}
                    height={190}
                    alt="Send"
                /> 
                <div>
                    <p className={styles.actionLabel}>Spend from Sub-wallets</p>
                    <p className={styles.actionExplainerLabel}>Now that you've splitted your wallet, you can now spend from your mini-wallets.</p>
                </div>
            </div>
        </section>
    </div>
  )
}

export default HowItWorks