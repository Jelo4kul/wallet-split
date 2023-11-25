import { createContainer } from 'unstated-next';
import { useState } from 'react';
import { executorABI, FamilyNFrenStates, SendStates, TabIds, validatorABI, validatorAddress } from '@/constants/constants';
import { encodeFunctionData, formatEther, isAddress, parseEther } from 'viem';
import { ECDSAProvider, getRPCProviderOwner, ValidatorMode } from '@zerodev/sdk';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import { arrToBytes, encodeCardObject } from '@/utils/utils';

function useDashboardData() {
    const [isSendClicked, setIsSendClicked] = useState(false);
    const [isUpdateFnfClicked, setIsUpdateFnfClicked] = useState(false);
    const [sendState, setSendState] = useState(SendStates.NOTSENT);
    const [addFnfState, setFnfState] = useState(FamilyNFrenStates.NOTADDED);
    const [sendData, setSendData] = useState({
        address: '',
        amount: '',
        selectedOption: '',
        fnfAddresses: ''
    })


    const { address: swAddress, reloadSwitch, triggerNavReload, publicClient, setAllocationData } = useContainer(Global);


    const handleOverlayClicked = (event) => {
        if (event.target == event.currentTarget) {
            closeModal();
        }
    }

    const closeModal = () => {
        setIsSendClicked(false)
        setIsUpdateFnfClicked(false);
        setFnfState(FamilyNFrenStates.NOTADDED);
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
        setEnable()
    }


    const setEnable = async () => {
        //TODO: Split wallet can't be called before creating a wallet
        const owner = getRPCProviderOwner(window.ethereum);
        const delimiter = /[\s,]+/;
        const familyNfrens = sendData.fnfAddresses?.split(delimiter);
        const allAddresesValid = familyNfrens.every(addr => isAddress(addr));

        if (!allAddresesValid) {
            throw new Error("Invalid Address")
        }

        setFnfState(FamilyNFrenStates.ADDING);;

        const allocs = await publicClient.readContract({
            address: validatorAddress,
            abi: validatorABI,
            functionName: 'getAllocations',
            args: [swAddress]
        })

        const cardObject = {
            ownerAddress: allocs[0],
            openseaAddress: allocs[1],
            familyNFrenAlloc: parseEther(formatEther(allocs[2])).toString(16).padStart(64, '0'),
            nftAlloc: parseEther(formatEther(allocs[3])).toString(16).padStart(64, '0'),
            generalAlloc: parseEther(formatEther(allocs[4])).toString(16).padStart(64, '0'),
            familyNfrens: [allocs[5], ...familyNfrens]
        };

        const enableData = encodeCardObject(cardObject);

        const ecdsaProvider = await ECDSAProvider.init({
            projectId: process.env.NEXT_PUBLIC_PROJECT_ID_SEPOLIA,
            owner
        })

        //This is the UserOperation Calldata
        const { hash } = await ecdsaProvider.sendUserOperation({
            target: validatorAddress,
            value: 0,
            data: encodeFunctionData({
                abi: validatorABI,
                functionName: 'enable',
                args: [enableData]
            })
        });

        //This will wait for the user operation to be included in a transaction that's been mined.
        await ecdsaProvider.waitForUserOperationTransaction(hash);

        setFnfState(FamilyNFrenStates.ADDED);

        console.log("Family and Friend Address updated");


        setAllocationData({ fnfAddresses: arrToBytes(cardObject.familyNfrens) })

        return new Promise((resolve) => {
            resolve(swAddress);
        });

    }


    const handleSendAction = (_tabId) => {

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
        addFnfState,
        setSendState,
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
