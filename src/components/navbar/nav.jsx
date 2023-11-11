'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import styles from './nav.module.css';
import { usePathname } from 'next/navigation';
import CustomRainbowkitBtn from '../rainbowkit/rainbowkit-connect-button';
import { ECDSAProvider, getRPCProviderOwner } from '@zerodev/sdk';
import { sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import GetStartedButton from '../getStartedButton/getStartedButton';
import { createPublicClient, formatEther, http } from 'viem';
import { validatorABI, validatorAddress } from '@/constants/constants';


const NavBar = () => {

  const { address, isConnected } = useAccount();
  const pathname = usePathname();
  const { saveSmartWalletAddress, setLoadingState, loading, saveBalance, balance, address: swAddress, setAllocationData, reloadSwitch, setPublicClient } = useContainer(Global);
  const transport = http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
  const publicClient = createPublicClient({
    chain: sepolia,
    transport,
  })


  useEffect(() => {
    setLoadingState(true);
    const createWallet = async () => {
      try {
        const ecdsaProvider = await ECDSAProvider.init({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID_SEPOLIA,
        owner: getRPCProviderOwner(window.ethereum),
        })
        const swAddress = await ecdsaProvider.getAddress()
        const bal = await publicClient.getBalance({address: swAddress});
        const allocs = await publicClient.readContract({
          address: validatorAddress,
          abi: validatorABI,
          functionName: 'getAllocations',
          args: [swAddress]
      })
      console.log("NAV",allocs)

        saveBalance(formatEther(bal+'')); 
        saveSmartWalletAddress(swAddress);
        setPublicClient(publicClient);
        setAllocationData(
          {
              fnf: formatEther(allocs[2]),
              nfts: formatEther(allocs[3]),
              miscellaneous: formatEther(allocs[4]),
              fnfAddresses: allocs[5],
          }
      )
    
        setLoadingState(false)
      } catch(error) {
        console.log(error)
      }
    }
    createWallet();
 
  }, [address, reloadSwitch])
  


  const paths = {
    "/":  <GetStartedButton isConnected={isConnected} />,
    "/createWallet": <button>Create Wallet</button>
  }

  const btnText = paths[pathname] ?? <CustomRainbowkitBtn 
    swAddress={loading ? "loading..." : swAddress}
    balance={balance}  
    />

  return (
    <nav className={styles.NavBar}>
        <Link className={styles.logo} href="/">WalletSplit</Link>
        <div className={styles.center_info}>
            <p>How it works</p>
        </div>
        <div className={styles.auth}>
            {btnText}
        </div>
    </nav>
  )
}

export default NavBar