'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import styles from './page.module.css';
import { ECDSAProvider, getRPCProviderOwner, ValidatorMode } from '@zerodev/sdk';
import { useRouter } from 'next/navigation';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';

const WalletCreation = () => {

  const [loading, setIsLoading] = useState(false);
  const [address, setKernelAddress] = useState('');
  const router = useRouter();
  const { address: swAddress, setAddress, owner, setOwnerObject, ecdsaProvider, setEcdsaProviderObj } = useContainer(Global);

  const createWallet = async () => {
    setIsLoading(true);
    try {
      const ecdsaProvider = await ECDSAProvider.init({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID_SEPOLIA,
        owner: getRPCProviderOwner(window.ethereum),
      })
      setEcdsaProviderObj(ecdsaProvider);
      setOwnerObject(getRPCProviderOwner(window.ethereum));
      setAddress(await ecdsaProvider.getAddress())
      //setKernelAddress(await ecdsaProvider.getAddress())
    } catch(error) {
      console.log(error)
    }
    setIsLoading(false);
    router?.push('/splitWallet');
  }

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
          <button onClick={createWallet}>{loading ? `creating smart wallet...` : `Create wallet`}</button>
    </section>
  )
}

export default WalletCreation