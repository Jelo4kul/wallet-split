'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import styles from './page.module.css';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import SendModal from '@/components/sendModal/sendModal';
import { ECDSAProvider, getRPCProviderOwner, ValidatorMode } from '@zerodev/sdk';
import { executorABI, SendStates, validatorAddress } from '@/constants/constants';
import { encodeFunctionData, parseEther } from 'viem';

const Miscellaneous = () => {

    const { allocations, setAllocationData, address: swAddress, reloadSwitch, triggerNavReload } = useContainer(Global);
    const [isSendClicked, setIsSendClicked] = useState(false);
    const [sendState, setSendState] = useState(SendStates.NOTSENT);
    const [sendData, setSendData] = useState({
        address: '',
        amount: '',
    })


    const handleSendClick = () => {
        setIsSendClicked(true);
    }

    const handleOverlayClicked = (event) => {
        if(event.target ==  event.currentTarget){
        closeModal();
        }
    }

    const closeModal = () => {
        setIsSendClicked(false)
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSendData({
            ...sendData,
            [name]: value
        })
    }
    
    const handleSubmit = (e) =>  {
        e.preventDefault();
    }

    const handleSendAction = () => {
        const amount = '0x' + parseEther(sendData.amount).toString(16).padStart(64, '0');
        makeTransfer(sendData.address, amount, "");
    }


    const makeTransfer = async ( _recipient, _amount, _data) => {
        //Set the AA wallet to plugin mode
        let ecdsaProvider = await ECDSAProvider.init({
            projectId: process.env.NEXT_PUBLIC_PROJECT_ID_SEPOLIA,
            owner: getRPCProviderOwner(window.ethereum),
            opts: {
                validatorConfig: {
                    mode: ValidatorMode.plugin,
                }
            }
        });
    
        console.log("Executing transaction");


        setSendState(SendStates.SENDING);
    
        //This is the UserOperation Calldata
        //Set the executor and validator for a specific function selector
        const { hash } = await ecdsaProvider.sendUserOperation({
            target: swAddress,
            data: encodeFunctionData({
                abi: executorABI,
                functionName: 'transfer',
                args: [_recipient, _amount, validatorAddress, _data]
            })
        })
    
        await ecdsaProvider.waitForUserOperationTransaction(hash);

        console.log("Transfer successful");
        triggerNavReload(!reloadSwitch);
        setSendState(SendStates.SENT);
    
    }
        



  return (
    <div className={styles.miscellaneous}>
        <p className={styles.title}>Miscellaneous</p>
        <p className={styles.subTitle}>You can send money to any address not in your family and friends address book</p>
        <section className={styles.miscBalanceContainer}>
            <p className={styles.miscWalletLabel}>Miscellaneous Balance</p>
            <p className={styles.miscWalletValue}>{allocations.miscellaneous}<span>ETH</span></p>
            <div className={styles.actions}>
                <div className={styles.actionsBox}>
                    <Image 
                        src="/send.svg"
                        width={20}
                        height={20}
                        alt="Send"
                    /> 
                    <p onClick={handleSendClick} className={styles.actionLabel}>Send</p>
                </div>
                <div className={styles.actionsBox}>
                    <Image 
                        src="/update.svg"
                        width={20}
                        height={20}
                        alt="Update"
                    /> 
                    <p className={styles.actionLabel}>Update</p>
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
            handleOverlayClicked={handleOverlayClicked}
            closeModal={closeModal} 
            handleSubmit={handleSubmit} 
            handleInputChange={handleInputChange} 
            sendData={sendData} 
            handleSendAction={handleSendAction} 
            sendState={sendState}
        />
    </div>
  )
}

export default Miscellaneous