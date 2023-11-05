'use client';

import Image from 'next/image'
import styles from './page.module.css';
import { sepolia } from 'viem/chains';
import { createPublicClient, http } from 'viem';
import { validatorABI, validatorAddress } from '@/constants/constants';
import { useEffect } from 'react';
import {  useAccount  } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';


export default function Home() {

  const { address: swAddress } = useAccount();
  const router = useRouter();
  const transport = http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
  const publicClient = createPublicClient({
      chain: sepolia,
      transport,
  });
  const {  isConnected } = useAccount();

  const { assignIsWalletSplitted } = useContainer(Global);

  const handleClick = async () => {
        const allocs = await publicClient.readContract({
          address: validatorAddress,
          abi: validatorABI,
          functionName: 'getAllocations',
          args: [swAddress]
      })

      //if it's a new smart wallet
      if(allocs[0] === "0x0000000000000000000000000000000000000000") {
        assignIsWalletSplitted(false);
        if(isConnected) {
          router.push('/splitWallet')
        } else {
          router.push("/createWallet");  
        }
      } else {
        console.log(allocs)
        router.push("/dashboard");
      }
  };

 return (
   <div className={styles.Home}>
     <section className={styles.Home_Left}>
        <h1>Manage your wallets better</h1>
        <p className={styles.sub_heading}>Split your wallet into mini sub-wallets and allocate a portion of your entire balance for each sub-wallet</p>
        <button onClick={handleClick}>Get Started</button>
        <div></div>
     </section>
     <section className={styles.Home_Right}>
        <p className={styles.heading}>Transform your wallet</p>
        <div className={styles.content}>
          <section className={styles.Home_Right_left}>
            <p className={styles.right_subHeading}>From this</p>
            <div className={styles.dummyLine}></div>
            <div className={styles.walletBalance}>
              <p className={styles.value}>$1,000</p>
              <p>Wallet Balance</p>
            </div>
          </section>
          <Image 
            src="/forward-arrow.svg"
            width={40}
            height={40}
            alt="split arrow"
            className={styles.splitArrow}
          />
          <section className={styles.Home_Right_right}>
            <p className={styles.right_subHeading}>To this</p>
            <div className={styles.dummyLine}></div>
            <section>
              <div className={styles.allocations}>
                <p  className={styles.splittedValue}>$300</p>
                <p>Family and Friends Balance</p>
              </div>
              <div className={styles.allocations}>
                <p  className={styles.splittedValue}>$500</p>
                <p>Miscellaneous Expenses Balance</p>
              </div>
              <div className={styles.allocations}>
                <p  className={styles.splittedValue}>$200</p>
                <p>NFTs Balance</p>
              </div>
            </section>
          </section>
        </div>
      
     </section>
   </div>

)
}
