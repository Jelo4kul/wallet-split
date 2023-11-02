'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { createPublicClient, http, isAddress, formatEther, parseEther, encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import { execAddress, kernelABI, openseaAddress, selector, validAfter, validatorAddress, validUntil } from '@/constants/constants';
import { useAccount } from 'wagmi';
// const { formatEther, parseEther, encodeFunctionData } = require('viem');
import { ECDSAProvider, getRPCProviderOwner } from '@zerodev/sdk';
import { useRouter } from 'next/navigation';

const SplitStates = {
    UNSPLIT: "Split",
    SPLITTING: "Splitting wallet...",
    SPLITTED: "Wallet Splitted"
}

const WalletSplit = () => {

  const [balance, setbalance] = useState('0');
  //this state is necessary to prevent re-hydration error
  const [isClient, setIsClient] = useState(false)
  const [isDepositClicked, setisDepositClicked] = useState(false)
  const [isSplitClicked, setisSplitClicked] = useState(false)
  const [splitState, setSplitState] = useState(SplitStates.UNSPLIT)
  const [isFnfClicked, setIsFnfClicked] = useState(false)
  const [allocations, setAllocations] = useState({
      fnf: '',
      miscellaneous: '',
      nfts: '',
      fnfAddresses: []
  })
  const [error, setError] = useState({
    invalidAddress: false
  })
  const router = useRouter();
 const { address: swAddress, connector, isConnected, isConnecting } = useAccount();
  //const { address: swAddress, ecdsaProvider, owner } = useContainer(Global);
  const transport = http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
  const publicClient = createPublicClient({
    chain: sepolia,
    transport,
  })

  useEffect(() => {
    if(splitState === SplitStates.SPLITTED){
        router.push("/dashboard");
    }
  }, [splitState]);

  useEffect(() => {
    const getSmartWalletBalance = async () => {
        let bal = await publicClient.getBalance({address: swAddress});
        setbalance(formatEther(bal+''));
        //prevents re-hydration error
        setIsClient(true);
    }
    getSmartWalletBalance();
  }, []);

  const encodeCardObject = ({ ownerAddress, openseaAddress, familyNFrenAlloc, nftAlloc, generalAlloc, familyNfrens }) => {
    let packedFnf = '';
    for (let fnf of familyNfrens) {
        packedFnf += fnf.substring(2);
    }
    const encodedData = ownerAddress + openseaAddress.substring(2) + familyNFrenAlloc + nftAlloc + generalAlloc + packedFnf;
    return encodedData;
  }
  
  const setExecution = async () => {
        //TODO: Split wallet can't be called before creating a wallet

        const owner = getRPCProviderOwner(window.ethereum);
        const delimiter = /[\s,]+/;


        const familyNfrens =  allocations?.fnfAddresses?.split(delimiter);
        const allAddresesValid = familyNfrens.every(addr => isAddress(addr));
        setError({
            ...error,
            invalidAddress: !allAddresesValid
        });

        if(!allAddresesValid){
            throw new Error("Invalid Address")
        }

        const cardObject = {
        ownerAddress: await owner.getAddress(),
        openseaAddress: openseaAddress,
        familyNFrenAlloc: parseEther(allocations.fnf).toString(16).padStart(64, '0'),
        nftAlloc: parseEther(allocations.nfts).toString(16).padStart(64, '0'),
        generalAlloc: parseEther(allocations.miscellaneous).toString(16).padStart(64, '0'),
        familyNfrens: familyNfrens
       };

        const enableData = encodeCardObject(cardObject);

        const ecdsaProvider = await ECDSAProvider.init({
            projectId: process.env.NEXT_PUBLIC_PROJECT_ID_SEPOLIA,
            owner
        })

        setSplitState(SplitStates.SPLITTING);
        //This is the UserOperation Calldata
        //Set the executor and validator for a specific function selector
        const { hash } = await ecdsaProvider.sendUserOperation({
            //The address here is the smart contract address after it has been deployed/created
            target: swAddress,
            value: 0,
            data: encodeFunctionData({
                abi: kernelABI,
                functionName: 'setExecution',
                args: [selector, execAddress, validatorAddress, validUntil, validAfter, enableData]
            })
        })

        //This will wait for the user operation to be included in a transaction that's been mined.
        await ecdsaProvider.waitForUserOperationTransaction(hash);

        console.log("Validator and Executor set");

        setSplitState(SplitStates.SPLITTED);
        
        return new Promise((resolve) => {
            resolve(swAddress);
        });

  }

  const handleDepositClicked = () => {
    setisDepositClicked(true)
  };

  const handleSplitClicked = async () => {
   // setisDepositClicked(true)
  setisSplitClicked(true);
  };

  const handleSplitAction = () => {
    setExecution();
  }

  const handleFnfClicked = () => {
    setIsFnfClicked(!isFnfClicked);
   };

  const handleInputChange = (e) => {

    const {name, value} = e.target;
    setAllocations({
        ...allocations,
        [name]: value
    })
  }

  const handleSubmit = (e) =>  {
    e.preventDefault();
  }

  const handleOverlayClicked = (event) => {
      //here we are using event delegation to prevent the child element from closing the modal.
      //The modal should only be closed by clicking the parent element
      //In summary we want to activate the onClick event on the parent and not the child element
      //event.target returns the parent element. event.currentTarget returns the exact child element that was clicked.
      if(event.target ==  event.currentTarget){
        closeModal();
      }
  }
  
  const handleCopy = () => {
    // Copy the selected text to the clipboard
    document.execCommand('copy');
  }

  const closeModal = () => {
    setisDepositClicked(false)
  }

  return (
    <section className={styles.walletSplit}>
        <section className={styles.top}>
            <div className={styles.top_left}>
                <div className={styles.walletAddressAndIcon}>
                    <p className={styles.walletAddress}>{isClient ? swAddress : "loading..." }</p>
                    <Image 
                        src="/copy.svg"
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
            {isSplitClicked ? 
            (
                <form onSubmit={handleSubmit} className={styles.allocForm}>
                    {error.invalidAddress && <div className={styles.error}>Invalid Family and Friend Address</div>}
                    <div className={styles.fnfMainContainer}>
                        <p>Family and Friends</p>
                        <div className={styles.fnfSubContainer}>
                            <div className={styles.labelAndInput}>
                                <label htmlFor="fnf">Allocation for Family and Friends:</label>
                                <input
                                    required
                                    type="number"
                                    id="fnf"
                                    name="fnf"
                                    value={allocations.fnf}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.addContainer}>
                                <Image 
                                    src="/add.svg"
                                    width={20}
                                    height={20}
                                    alt="Add"
                                    className={styles.addIcon}
                                    onClick={handleFnfClicked}
                                />
                                <p onClick={handleFnfClicked}>Add addresses of your family and friends</p>
                            </div>
                            {isFnfClicked && 
                              <textarea
                                    required
                                    value={allocations.fnfAddresses}
                                    onChange={handleInputChange}
                                    name="fnfAddresses"
                                    rows="4"
                                    cols="50"
                                    placeholder="Enter the addresses of your family and friends separated by a comma"
                              />
                          }
                          
                        </div>
                    </div>
                   
                    <div className={styles.labelAndInput}>
                        <label htmlFor="miscellaneous">Allocation for Miscellaneous Expenses:</label>
                        <input
                            required
                            type="number"
                            id="miscellaneous"
                            name="miscellaneous"
                            value={allocations.miscellaneous}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.labelAndInput}>
                        <label htmlFor="nfts">Allocation for Nft purchases:</label>
                        <input
                            required
                            type="number"
                            id="nfts"
                            name="nfts"
                            value={allocations.nfts}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button onClick={handleSplitAction}>{splitState}</button>
                </form>
            ) : (
                    
            balance === '1' ? 
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
            )}
       
        </section>
        {isDepositClicked && 
             <div className={styles.overlay} onClick={handleOverlayClicked}>
                <div className={styles.modal}>
                    <div className={styles.closeModal} onClick={closeModal}>
                        <Image 
                            src="/close-circle.svg"
                            width={40}
                            height={40}
                            alt="Split wallet"
                            className={styles.closeModalImage}
                        />
                    </div>
                    <p className={styles.sendEthLabel}>Send Eth to this Address</p>
                    <div className={styles.addressAndIcon}>
                        <p>{swAddress}</p>
                        <Image 
                            src="/wallet.svg"
                            width={20}
                            height={20}
                            alt="Split wallet"
                        />
                 </div>
             </div>
             </div>
        }  
    </section>
  )
}

export default WalletSplit;