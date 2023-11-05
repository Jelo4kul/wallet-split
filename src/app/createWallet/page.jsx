'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import { useAccount, useConnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const WalletCreation = () => {

 // const [loading, setIsLoading] = useState(false);
  //const [address, setKernelAddress] = useState('');
  const router = useRouter();
  const { isWalletSplitted, assignIsWalletSplitted } = useContainer(Global);
  const {  isConnected } = useAccount();

  useEffect(() => {
    //isConnected == true, means user has already created smart wallet
    if(isConnected){
      if(isWalletSplitted) {
        router?.push('/dashboard');
      }else {
        router?.push('/splitWallet');
      }
    }
  }, [isConnected])

  const { openConnectModal } = useConnectModal();

  return (
    <section className={styles.walletCreation}>
          <Image 
            src="/wallet.svg"
            width={300}
            height={300}
            alt="Split wallet"
          />
          <h1>Create a smart wallet</h1>
          <p className={styles.subHeading}>Creating a smart wallet enables you split your wallet into sub-wallet groups</p>
          {/*<CustomRainbowkitBtn />*/}
          <button onClick={openConnectModal}>Create Wallet</button>
    </section>
  )
}

export default WalletCreation