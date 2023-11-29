'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import { SplitStates } from '@/constants/constants';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import DepositModal from '@/components/depositModal/depositModal';
import SplitForm from '@/components/splitForm/splitForm';
import { formatEther } from 'viem';


const WalletSplit = () => {
 
  //this state is necessary to prevent re-hydration error
  const [isClient, setIsClient] = useState(false)
  const [isCopied, setIsCopied] = useState(false);
  const [isDepositClicked, setisDepositClicked] = useState(false)
  const { isWalletSplitted, assignIsWalletSplitted, address: swAddress, balance, saveBalance, setSplitFormState, splitFormState, publicClient, isConnectedTraditionalLogin } = useContainer(Global);
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
 const { isConnected } = useAccount();

  useEffect(() => {
    if(splitFormState.splitState === SplitStates.SPLITTED){
        assignIsWalletSplitted(true);
        router.push("/dashboard");
    }
  }, [splitFormState.splitState]);

  useEffect(() => {
    //prevents re-hydration error
    setIsClient(true);
    const checkIfWalletisSpliited = async () => {
        //if user have splitted wallet
        if(isWalletSplitted) {
            router.push("/dashboard");
        }
    }
    checkIfWalletisSpliited();

    const intervalId = setInterval(async () => {
       const bal = await publicClient.getBalance({address: swAddress});
       if(bal > 0){
           clearInterval(intervalId);
           saveBalance(formatEther(bal+''));
       }
      }, 5000);
  
      // Cleanup the interval when the component is unmounted
      return () => clearInterval(intervalId);
  }, [swAddress]);

  const handleDepositClicked = () => {
      if(!isConnected && !isConnectedTraditionalLogin) {
          //true logic should be to open a modal that lets the user choose between web3 and web2
        openConnectModal();
      } else {
        setisDepositClicked(true)
      }
  };

  const handleSplitClicked = async () => {
        // setisDepositClicked(true)
        //setisSplitClicked(true);
        setSplitFormState((prevState) => ({
            ...prevState,
            isSplitClicked: true
        }));
  };

  const handleOverlayClicked = (event) => {
      //here we are using event delegation to prevent the child element from closing the modal.
      //The modal should only be closed by clicking the parent element
      //In summary we want to activate the onClick event on the parent and not the child element
      //event.target returns the parent element. event.currentTarget returns the exact child element that was clicked.
      if(event.target ==  event.currentTarget){
        closeModal();
        closeDepositModal();
      }
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(swAddress);
    setIsCopied(true);
    setTimeout(() => {
        setIsCopied(false);
    }, 700);
  }

  const closeDepositModal = () => {
      setisDepositClicked(false);
  }

    const closeModal = () => {
        setSplitFormState((prevState) => ({
            ...prevState,
            isSplitClicked: false
        }));
    }

  return (
    <section className={styles.walletSplit}>
        <section className={styles.top}>
            <div className={styles.top_left}>
                <div className={styles.walletAddressAndIcon}>
                    <p className={styles.walletAddress}>{isClient ? swAddress : "loading..." }</p>
                    <Image 
                        src={isCopied ? '/copied.svg' : '/copy.svg'}
                        width={20}
                        height={20}
                        alt="copy"
                        className={styles.copyIcon}
                        onClick={handleCopy}
                    />
                </div>
                <p className={styles.walletAddressLabel}>Smart Wallet Address</p>
            </div>
            <div className={styles.top_divider}></div>
            <div className={styles.top_right}>
                <p className={styles.walletValue}>{isClient ? balance : "loading..."}<span>Eth</span></p>
                <p className={styles.walletValueLabel}>Smart Wallet Balance</p>
            </div>
        </section>
        <section className={styles.bottom}>
            {splitFormState.isSplitClicked ? 
                (
                    <SplitForm splitState={splitFormState.splitState}/>
                ) : 
                (
                        
                    balance === '0' ? 
                        <>
                            <Image 
                                src="/empty-wallet.svg"
                                width={200}
                                height={200}
                                alt="Split wallet"
                            />
                            <p className={styles.depositGuideLabel}>Your wallet balance is empty. Deposit to enable splitting</p>
                            <button onClick={handleDepositClicked}>Deposit</button>
                        </> : 
                        <>
                            <Image 
                                src="/split-wallet.svg"
                                width={200}
                                height={200}
                                alt="Split wallet"
                            />
                            <p className={styles.timeToSplit}>Now that you have funded your wallet, it is time to split</p>
                            <button onClick={handleSplitClicked}>Split Wallet</button>
                        </>
                )
            }
       
        </section>
        <DepositModal 
            isDepositClicked={isDepositClicked} 
            handleOverlayClicked={handleOverlayClicked} 
            closeModal={closeDepositModal} 
            swAddress={swAddress} 
            handleCopy = {handleCopy}
            isCopied = {isCopied}
        />
    </section>
  )
}

export default WalletSplit;