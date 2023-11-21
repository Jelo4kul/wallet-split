'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import DashboardData from '@/state/dashboard';
import SendModal from '@/components/sendModal/sendModal';
import { entryPointABI, entryPointAddress, TabIds } from '@/constants/constants';
import NewFnfModal from '@/components/newFnfModal/newFnfModal';
import { ethers } from 'ethers';
import Table from '@/components/uicomponents/table';

// const lockieABI = require("./lockieAbi.json");
// const { BigNumber } = require("@ethersproject/bignumber");
// require("dotenv").config();


const FamilyAndFriends = () => {

    const { isSendClicked, setIsSendClicked, isUpdateFnfClicked, setIsUpdateFnfClicked } = useContainer(DashboardData);
    const { allocations, address } = useContainer(Global);
    const [isFnfAddressesUpdated, setIsFnfAddresseUpdated] = useState(false)

    const handleSendClick = () => {
        setIsSendClicked(true);
    }

    const handleUpdateFnfClick = () => {
        setIsUpdateFnfClicked(true);
        setIsFnfAddresseUpdated(false);
    }

    
    useEffect(() => {
      setIsFnfAddresseUpdated(true);
      const fetchTransactions = async () => {
          const provider = new ethers.JsonRpcProvider(
            `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
          );
          const swContract = new ethers.Contract(entryPointAddress, entryPointABI, provider);
          const userOpFilter = swContract.filters.UserOperationEvent(null, address, null);
          const useropEvents = await swContract.queryFilter(userOpFilter); 
          console.log(useropEvents[0]);
      }
      fetchTransactions();
    }, [allocations])
    

  return (
    <div className={styles.fnf}>
        <p className={styles.title}>Family and Friends</p>
        <p className={styles.subTitle}>Send money to any address in your family and friends address book</p>
        <section className={styles.fnfBalanceContainer}>
            <p className={styles.fnfWalletLabel}>Family and Friends Balance</p>
            <p className={styles.fnfWalletValue}>{allocations.fnf}<span>ETH</span></p>
            <div className={styles.actions}>
                <div className={styles.actionsBox}>
                    <Image 
                        src="/send.svg"
                        width={18}
                        height={18}
                        alt="Send"
                    /> 
                    <p onClick={handleSendClick} className={styles.actionLabel}>Send</p>
                </div>
                <div className={styles.actionsBox}>
                    <Image 
                        src="/add-black.svg"
                        width={18}
                        height={18}
                        alt="add"
                    /> 
                    <p onClick={handleUpdateFnfClick} className={styles.actionLabel}>Add Family Member or Friend</p>
                </div>
            </div>
        </section>
        <section className={styles.transacSec}>
            <p className={styles.recTransacLabel}>Recent Transactions</p>
            <div className={styles.trasancImageBox}>
                <Image 
                    src="/recent-transac.svg"
                    width={200}
                    height={200}
                    alt="Send"
                    className={styles.transacImage}
                /> 
                <p>No recent transations</p>
            </div>
            {/* <Table tableData={tableData(subData)} /> */}
        </section>
        <SendModal 
            isSendClicked={isSendClicked} 
            tabId = {TabIds.fnf}
        />
        {!isFnfAddressesUpdated &&    
         <NewFnfModal
            isUpdateFnfClicked={isUpdateFnfClicked}
         />
        }
    </div>
  )
}

export default FamilyAndFriends

// const ethers = require("ethers");
// const lockieABI = require("./lockieAbi.json");
// const { BigNumber } = require("@ethersproject/bignumber");
// require("dotenv").config();

// async function main() {
//     const lockieAddress = "0x4bd5643ac6f66a5237E18bfA7d47cF22f1c9F210";
//     const provider = new ethers.JsonRpcProvider(
//         https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_ETH_GOERLI_KEY}
//     );

//     const lockieContract = new ethers.Contract(lockieAddress, lockieABI, provider)

//     const userAddress = "0xa2140490Ee061762cB781ad59F16e5268117a846";
//     const depositFilter = lockieContract.filters.Deposit(null, null, userAddress, null, null);
//     const withdrawFilter = lockieContract.filters.Withdraw(null, null, userAddress, null);

//     const depositEvents = await lockieContract.queryFilter(depositFilter);
//     const withdrawEvents = await lockieContract.queryFilter(withdrawFilter);

//     let totalDeposit = BigNumber.from('0');
//     let totalWithdrawals = BigNumber.from('0');

//     for (let i = 0; i < depositEvents.length; i++) {
//         let indexedAndNonIndexedData = depositEvents[i].args
//         totalDeposit = totalDeposit.add(indexedAndNonIndexedData[3])
//     }

//     for (let i = 0; i < withdrawEvents.length; i++) {
//         let indexedAndNonIndexedData = depositEvents[i].args
//         totalWithdrawals = totalWithdrawals.add(indexedAndNonIndexedData[3])
//     }

//     let currentBalance = totalDeposit.sub(totalWithdrawals);

//     console.log("Total deposit:", totalDeposit.toString())
//     console.log("Total withdrawals:", totalWithdrawals.toString())
//     console.log("Current balance:", currentBalance.toString())

// }

// main();
// // "ethers": "^6.8.1",