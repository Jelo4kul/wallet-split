'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import DashboardData from '@/state/dashboard';
import SendModal from '@/components/sendModal/sendModal';
import { BASE_URL, entryPointABI, entryPointAddress, TabIds } from '@/constants/constants';
import NewFnfModal from '@/components/newFnfModal/newFnfModal';
import { ethers, Interface } from 'ethers';
import Table from '@/components/uicomponents/table';
import Link from 'next/link';
import axios from 'axios';
import { formatEther } from 'viem';
import { splitAddresses } from '@/utils/utils';


const FamilyAndFriends = () => {

    const { isSendClicked, setIsSendClicked, isUpdateFnfClicked, setIsUpdateFnfClicked } = useContainer(DashboardData);
    const { allocations, address } = useContainer(Global);
    const [isFnfAddressesUpdated, setIsFnfAddresseUpdated] = useState(false)
    const [transactions, setTransactions] = useState([]);
    const listOfFnfAddresses = splitAddresses(allocations.fnfAddresses);

    const handleSendClick = () => {
        setIsSendClicked(true);
    }

    const handleUpdateFnfClick = () => {
        setIsUpdateFnfClicked(true);
        setIsFnfAddresseUpdated(false);
    }

    useEffect(() => {
       let txs=[];
      setIsFnfAddresseUpdated(true);
      const fetchTransactions = async () => {
          const provider = new ethers.JsonRpcProvider(BASE_URL);
          const swContract = new ethers.Contract(entryPointAddress, entryPointABI, provider);
          const userOpFilter = swContract.filters.UserOperationEvent(null, address, null);
          const useropEvents = await swContract.queryFilter(userOpFilter); 
          if (useropEvents.length === 0) {
            //continue;
          }
          let blocksBodyParams = [];
          //Use alchemy API to fetch the transactionObject using the transaction hash
          //Here we construct the object for each transaction 
          for (let i = 0; i < useropEvents.length; i++) {
            blocksBodyParams.push(
                {
                    jsonrpc: "2.0",
                    method: "eth_getTransactionByHash",
                    params: [`${useropEvents[i].transactionHash}`],
                    id: 1
                }
            )
        }

        let { data: transactionData } = await axios.post(BASE_URL, blocksBodyParams)
        let decTx;
        for (let td of transactionData) {
            //the hexdata(0x1fad948c) below is the function selector of handleOps
            if ('0x1fad948c' === td.result.input.substring(0, 10)) {
                const iface = new Interface([
                    'function handleOps((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[], address)'
                ])

                decTx = iface.decodeFunctionData('handleOps', td.result.input)

                let userOpCalldata = decTx[0][0][3];

                let callDataDecoded;
                //the hexdata(0x92b4dfd2) below is the function selector of transfer function in the executor contract
                if ('0x92b4dfd2' === userOpCalldata.substring(0, 10)) { 
                    const iface = new Interface([
                        'function transfer(address _receipient, uint _amount, address _validator, bytes calldata data)'
                    ])
                    callDataDecoded = iface.decodeFunctionData('transfer', userOpCalldata);
                   
                    txs.push({receipient: callDataDecoded[0], amount: callDataDecoded[1], transaction: td.result.hash})
                }
            }
        }
        setTransactions([...txs]);
      }
      fetchTransactions();
    }, [allocations])
    
    const tableData = (subData) => (
        {
            title: ["Amount", "Receipient", "Transaction"],
            stylesTh: {   
                "0": {
                    paddingLeft: "28px",
                }
            },
            stylesTd: {   
                "0": {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "20px",
                    paddingLeft: "30px",
                },
            },
            rows: createRows(subData)
        }
    )

    const createRows = (subData) => {

        if(subData.length == 0){
            return <p>Loading</p> 
        } else {
            console.log( subData)
     
          //const fArr  = subData?.filter((address) => listOfFnfAddresses.includes(address));
            return subData?.map(({ receipient, amount, transaction }) => (  
                [   
                   <span>{formatEther(amount)}</span>,
                    <span>{receipient}</span>,
                    <Link href={`https://sepolia.etherscan.io/tx/${transaction}`}>view transaction</Link>,
            
                 ]
           ))
        }
     
     };

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
            {(transactions.length != 0) ? 
                <Table tableData={tableData(transactions)} />  
                : 
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
            }
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

