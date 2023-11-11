import Image from 'next/image';
import React from 'react'
import styles from './splitForm.module.css';
import { ECDSAProvider, getRPCProviderOwner } from '@zerodev/sdk';
import { isAddress, parseEther, encodeFunctionData } from 'viem';
import { execAddress, kernelABI, openseaAddress, selector, validAfter, validatorABI, validatorAddress, validUntil, SplitStates } from '@/constants/constants';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';


const SplitForm = ({ splitState, style}) => {

    console.log("splitform")

    const {address, splitFormState, setSplitFormState} = useContainer(Global)


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
    
    
            const familyNfrens =  splitFormState.formData?.fnfAddresses?.split(delimiter);
            const allAddresesValid = familyNfrens.every(addr => isAddress(addr));
            setSplitFormState((prevState) => ({
              ...prevState,
              error: {
                  ...prevState.formData,
                  invalidAddress: !allAddresesValid
              },
            }));
            if(!allAddresesValid){
                throw new Error("Invalid Address")
            }
    
            const cardObject = {
            ownerAddress: await owner.getAddress(),
            openseaAddress: openseaAddress,
            familyNFrenAlloc: parseEther(splitFormState.formData.fnf).toString(16).padStart(64, '0'),
            nftAlloc: parseEther(splitFormState.formData.nfts).toString(16).padStart(64, '0'),
            generalAlloc: parseEther(splitFormState.formData.miscellaneous).toString(16).padStart(64, '0'),
            familyNfrens: familyNfrens
           };
    
            const enableData = encodeCardObject(cardObject);
    
            const ecdsaProvider = await ECDSAProvider.init({
                projectId: process.env.NEXT_PUBLIC_PROJECT_ID_SEPOLIA,
                owner
            })
    
            setSplitFormState((prevState) => ({
              ...prevState,
              splitState: SplitStates.SPLITTING
            }));
 
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

            setSplitFormState((prevState) => ({
              ...prevState,
              splitState: SplitStates.SPLITTED
            }));
  
            
            return new Promise((resolve) => {
                resolve(address);
            });
    
      }
    
      const handleSplitAction = () => {
        setExecution();
      }
    
      const handleFnfClicked = () => {
        setSplitFormState((prevState) => ({
          ...prevState,
          isFnfClicked: !prevState.isFnfClicked,
        }));
       };
    
      const handleInputChange = (e) => {
    
        const {name, value} = e.target;
        setSplitFormState((prevState) => ({
            ...prevState,
            formData: {
                ...prevState.formData,
                [name]: value
            },
        }));
      }
    
      const handleSubmit = (e) =>  {
        e.preventDefault();
      }

  return (
    <form onSubmit={handleSubmit} className={styles.allocForm} style={style}>
        {splitFormState.error.invalidAddress && <div className={styles.error}>Invalid Family and Friend Address</div>}
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
                        value={splitFormState.formData.fnf}
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
                {splitFormState.isFnfClicked && 
                <textarea
                        required
                        value={splitFormState.formData.fnfAddresses}
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
                value={splitFormState.formData.miscellaneous}
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
                value={splitFormState.formData.nfts}
                onChange={handleInputChange}
            />
        </div>
        <button onClick={handleSplitAction}>{splitState}</button>
    </form>
  )
}

export default SplitForm