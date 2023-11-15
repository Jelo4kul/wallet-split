import { createContainer } from 'unstated-next';
import { useState } from 'react';
import { executorABI, SendStates, TabIds, validatorABI, validatorAddress } from '@/constants/constants';
import { encodeFunctionData, parseEther } from 'viem';
import { ECDSAProvider, getRPCProviderOwner, ValidatorMode } from '@zerodev/sdk';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';

function useDashboardData() {
    const [isSendClicked, setIsSendClicked] = useState(false);
    const [isUpdateFnfClicked, setIsUpdateFnfClicked] = useState(false);
    const [sendState, setSendState] = useState(SendStates.NOTSENT);
    const [sendData, setSendData] = useState({
        address: '',
        amount: '',
        selectedOption: ''
    })


    const { address: swAddress, reloadSwitch, triggerNavReload } = useContainer(Global);


    const handleOverlayClicked = (event) => {
        if (event.target == event.currentTarget) {
            closeModal();
        }
    }

    const closeModal = () => {
        setIsSendClicked(false)
        setIsUpdateFnfClicked(false);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        setSendData({
            ...sendData,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleFnfUpdateAction = () => {

    }


    // const encodeCardObject = ({ ownerAddress, openseaAddress, familyNFrenAlloc, nftAlloc, generalAlloc, familyNfrens }) => {
    //     let packedFnf = '';
    //     for (let fnf of familyNfrens) {
    //         packedFnf += fnf.substring(2);
    //     }
    //     const encodedData = ownerAddress + openseaAddress.substring(2) + familyNFrenAlloc + nftAlloc + generalAlloc + packedFnf;
    //     return encodedData;
    //   }


    // const setExecution = async () => {
    //     //TODO: Split wallet can't be called before creating a wallet
    //     const owner = getRPCProviderOwner(window.ethereum);
    //     const delimiter = /[\s,]+/;
    //     const familyNfrens = splitFormState.formData?.fnfAddresses?.split(delimiter);
    //     const allAddresesValid = familyNfrens.every(addr => isAddress(addr));

    //     if (!allAddresesValid) {
    //         throw new Error("Invalid Address")
    //     }

    //     const allocs = await publicClient.readContract({
    //         address: validatorAddress,
    //         abi: validatorABI,
    //         functionName: 'getAllocations',
    //         args: [swAddress]
    //     })

    //     const cardObject = {
    //         ownerAddress: allocs[0],
    //         openseaAddress: allocs[1],
    //         familyNFrenAlloc: allocs[2],
    //         nftAlloc: allocs[3],
    //         generalAlloc: allocs[4],
    //         familyNfrens: familyNfrens
    //     };

    //     //     const cardObject = {
    //     //     ownerAddress: await owner.getAddress(),
    //     //     openseaAddress: openseaAddress,
    //     //     familyNFrenAlloc: parseEther(splitFormState.formData.fnf).toString(16).padStart(64, '0'),
    //     //     nftAlloc: parseEther(splitFormState.formData.nfts).toString(16).padStart(64, '0'),
    //     //     generalAlloc: parseEther(splitFormState.formData.miscellaneous).toString(16).padStart(64, '0'),
    //     //     familyNfrens: familyNfrens
    //     //    };

    //     const enableData = encodeCardObject(cardObject);

    //     const ecdsaProvider = await ECDSAProvider.init({
    //         projectId: process.env.NEXT_PUBLIC_PROJECT_ID_SEPOLIA,
    //         owner
    //     })

    //     //This is the UserOperation Calldata
    //     //Set the executor and validator for a specific function selector
    //     const { hash } = await ecdsaProvider.sendUserOperation({
    //         //The address here is the smart contract address after it has been deployed/created
    //         target: swAddress,
    //         value: 0,
    //         data: encodeFunctionData({
    //             abi: validatorABI,
    //             functionName: 'enable',
    //             args: [enableData]
    //         })
    //     })

    //     //This will wait for the user operation to be included in a transaction that's been mined.
    //     await ecdsaProvider.waitForUserOperationTransaction(hash);

    //     console.log("Family and Friend Address updated");

    //     return new Promise((resolve) => {
    //         resolve(swAddress);
    //     });

    // }


    const handleSendAction = (_tabId) => {
        console.log(sendData)
        const amount = '0x' + parseEther(sendData.amount).toString(16).padStart(64, '0');
        if (_tabId == TabIds.misc) {
            makeTransfer(sendData.address, amount, "");
        } else if (_tabId == TabIds.fnf) {
            if (!sendData.selectedOption) {
                throw new Error("Please select an address")
            }
            makeTransfer(sendData.selectedOption, amount, "");
        }
    }

    const makeTransfer = async (_recipient, _amount, _data) => {
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
        console.log(swAddress, _recipient)
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


    return {
        isSendClicked,
        isUpdateFnfClicked,
        sendState,
        sendData,
        setIsSendClicked,
        setIsUpdateFnfClicked,
        closeModal,
        handleOverlayClicked,
        handleSubmit,
        handleInputChange,
        handleSendAction,
        handleFnfUpdateAction
    };
}

const DashboardData = createContainer(useDashboardData);

export default DashboardData;
