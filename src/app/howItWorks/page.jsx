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
                    <p className={styles.actionExplainerLabel}>ry. Lor text evebled itsunic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop pu</p>
                </div>
            </div>
            <Image 
                    src="/forward-arrow.svg"
                    width={20}
                    height={20}
                    alt="forward arrow"
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
                    <p className={styles.actionExplainerLabel}>ry. Lor text eer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop pu</p>
                </div>
            </div>
            <Image 
                    src="/forward-arrow.svg"
                    width={20}
                    height={20}
                    alt="forward arrow"
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
                    <p className={styles.actionExplainerLabel}>ryo make a type t onlre recently with desktop pu</p>
                </div>
            </div>
        </section>
    </div>
  )
}

export default HowItWorks