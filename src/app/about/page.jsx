
'use client';

import {  useAccount, useConnect, useEnsName, useNetwork, useDisconnect  } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { socialConnector } from '@/components/WagmiWrapper';
import { useState } from 'react';
import { ECDSAProvider, getRPCProviderOwner, ValidatorMode } from '@zerodev/sdk'
const { encodeFunctionData, parseAbi, createPublicClient, http, stringToBytes, parseEther } = require('viem');
import { ZeroDevWeb3Auth, ZeroDevWeb3AuthWithModal } from '@zerodev/web3auth';
import { useMemo } from 'react';


let selector, execAddress, validatorAddress, validUntil, validAfter, enableData;
selector = '0x92b4dfd2';//'0xbe45fd62';
execAddress = '0x2F8D2EF350bA3259977158caB11fE57599B293eE';
validatorAddress = '0x8E1232e9d68f3ee9F681a51637079D78b67CA244';
validUntil = 0; // is the timestamp at which the enabledData expires. When set to 0, it never expires
validAfter = 0; //is the timestamp at which the enabledData becomes active. When set to 0, it's immediately active
let openseaAddress = '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC';
let friendsAddress = '0x79d899379844d35a1a1f5d51d3185dd821f44dc1';
let familyNFrenAlloc = parseEther('0.001');
let nftAlloc = parseEther('0.001');
let generalAlloc = parseEther('0.001');
let familyNfrens = [
    '0x64d899379844d35a1a1f5d51d3185dd821f44dc1',
    '0x11d899379844d35a1a1f5d51d3185dd821f44d11',
    '0x22d899379844d35a1a1f5d51d3185dd821f44d11'
];
//THE Executor contract we will be interacting with
const executorABI = parseAbi([
  'function transfer(address _receipient, uint _amount, address _validator, bytes calldata data) external'
]);

const kernelABI = parseAbi([
  'function setExecution(bytes4 _selector, address _executor, address _validator, uint48 _validUntil, uint48 _validAfter, bytes calldata _enableData) external payable',
]);

const encodeCardObject = ({ ownerAddress, openseaAddress, familyNFrenAlloc, nftAlloc, generalAlloc, familyNfrens }) => {
  let packedFnf = '';
  for (let fnf of familyNfrens) {
      packedFnf += fnf.substring(2);
  }
  const encodedData = ownerAddress + openseaAddress.substring(2) + familyNFrenAlloc + nftAlloc + generalAlloc + packedFnf;
  return encodedData;
}

export default function About() {

  const [address, setAddress] = useState('')
  const [owner, setOwner] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ecdsaProvider, setEcdsaProvider] = useState(null);

  const createWallet = async () => {
    setLoading(true)
    try {
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts"
      // })
      const ecdsaProvider = await ECDSAProvider.init({
        projectId: "d7071a67-318c-4adf-9b9b-609f97aa8ef3",
        owner: getRPCProviderOwner(window.ethereum),
      })
      setEcdsaProvider(ecdsaProvider);
      setOwner(getRPCProviderOwner(window.ethereum));
      setAddress(await ecdsaProvider.getAddress())
    } catch(error) {
      console.log(error)
    }
    setLoading(false)
  }

  const setExecution = async () => {
    //TODO: SAplit wallet can't be called before creating a wallet
    const address = await ecdsaProvider.getAddress();
    console.log('Smart wallet address:', address);

    console.log(owner)

    const cardObject = {
      ownerAddress: await owner.getAddress(),
      openseaAddress: openseaAddress,
      familyNFrenAlloc: familyNFrenAlloc.toString(16).padStart(64, '0'),
      nftAlloc: nftAlloc.toString(16).padStart(64, '0'),
      generalAlloc: generalAlloc.toString(16).padStart(64, '0'),
      familyNfrens: familyNfrens
  };

    enableData = encodeCardObject(cardObject);
    //This is the UserOperation Calldata
    //Set the executor and validator for a specific function selector
    const { hash } = await ecdsaProvider.sendUserOperation({
        //The address here is the smart contract address after it has been deployed/created
        target: address,
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

    return new Promise((resolve) => {
        resolve(address);
    });
  }

  const makeTransfer = async () => {
       //Set the AA wallet to plugin mode
      let ecdsaProvider22 = await ECDSAProvider.init({
        projectId: "d7071a67-318c-4adf-9b9b-609f97aa8ef3",
        owner: owner,
        opts: {
            validatorConfig: {
                mode: ValidatorMode.plugin,
            }
        }
      });

    console.log("Executing transaction");

    const _amount = '0x' + parseEther('0.1').toString(16).padStart(64, '0');;
    //This is the UserOperation Calldata
    //Set the executor and validator for a specific function selector
    try {
      const { hash } = await ecdsaProvider22.sendUserOperation({
        //The address of our kernel contract
        //If you call a different contract other than the kernel contract, the calldata will be 
        //prepended with the functionSelector of the execute function in the Kernel contract and its parameters.
        target: address,
        data: encodeFunctionData({
            abi: executorABI,
            functionName: 'transfer',
            args: [friendsAddress, _amount, validatorAddress, ""]
        })
    })

    await ecdsaProvider.waitForUserOperationTransaction(hash);

    console.log("Transfer completed");
    } catch (error) {
      console.log(error);
    }
  
  }

  return (
    <div>
      <div>
      <button onClick={createWallet} disabled={loading}>{ loading ? 'loading...' : 'Create Wallet'}</button>
      <button onClick={setExecution}>Set Execution</button>
      <button onClick={makeTransfer}>Transfer</button>
      </div>
      {address && 
        <div>
          <label>Wallet: {address}</label>
        </div>
      }
    </div>
  )

}
