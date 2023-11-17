'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import DashboardData from '@/state/dashboard';
import SendModal from '@/components/sendModal/sendModal';
import { TabIds } from '@/constants/constants';
import NewFnfModal from '@/components/newFnfModal/newFnfModal';

const FamilyAndFriends = () => {

    const { isSendClicked, setIsSendClicked, isUpdateFnfClicked, setIsUpdateFnfClicked } = useContainer(DashboardData);
    const { allocations } = useContainer(Global);
    const [isFnfAddressesUpdated, setIsFnfAddresseUpdated] = useState(false)

    const handleSendClick = () => {
        setIsSendClicked(true);
    }

    const handleUpdateFnfClick = () => {
        setIsUpdateFnfClicked(true);
        setIsFnfAddresseUpdated(false);
    }

    
    useEffect(() => {
      //refresh component
      console.log("james",allocations);
      setIsFnfAddresseUpdated(true);
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