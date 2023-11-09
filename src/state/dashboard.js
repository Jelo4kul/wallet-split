import { createContainer } from 'unstated-next';
import { useState } from 'react';
import { executorABI, SendStates, validatorAddress } from '@/constants/constants';
import { encodeFunctionData, parseEther } from 'viem';
import { ECDSAProvider, getRPCProviderOwner, ValidatorMode } from '@zerodev/sdk';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';

function useDashboardData() {
    const [isSendClicked, setIsSendClicked] = useState(false);
    const [sendState, setSendState] = useState(SendStates.NOTSENT);
    const [sendData, setSendData] = useState({
        address: '',
        amount: '',
        selectedOption: 'option1'
    })


    const { address: swAddress, reloadSwitch, triggerNavReload } = useContainer(Global);


    const handleOverlayClicked = (event) => {
        if (event.target == event.currentTarget) {
            closeModal();
        }
    }

    const closeModal = () => {
        setIsSendClicked(false)
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

    const handleSendAction = () => {
        const amount = '0x' + parseEther(sendData.amount).toString(16).padStart(64, '0');
        makeTransfer(sendData.address, amount, "");
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
        sendState,
        sendData,
        setIsSendClicked,
        closeModal,
        handleOverlayClicked,
        handleSubmit,
        handleInputChange,
        handleSendAction
    };
}

const DashboardData = createContainer(useDashboardData);

export default DashboardData;
