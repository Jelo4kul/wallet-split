import { createContainer } from 'unstated-next';
import { useState } from 'react';
import { SplitStates } from '@/constants/constants';


function useData() {
    const [address, setSmartWalletAddress] = useState('');
    const [balance, setBalance] = useState('');
    const [reloadSwitch, setNavReload] = useState(false);
    const [loading, setLoading] = useState(false)
    const [isWalletSplitted, setIsWalletSplitted] = useState(false);
    const [allocations, setAllocations] = useState({
        fnf: '0',
        miscellaneous: '0',
        nfts: '0',
        fnfAddresses: ''
    })
    const [splitFormState, setSplitFormState] = useState({
        isSplitClicked: false,
        splitState: SplitStates.UNSPLIT,
        isFnfClicked: false,
        formData: {
            fnf: '0',
            miscellaneous: '0',
            nfts: '0',
            fnfAddresses: ''
        },
        error: {
            invalidAddress: false
        }
    })

    const setAllocationData = (_allocData) => {
        setAllocations(
            {
                ...allocations,
                ..._allocData
            }
        )
    };

    const assignIsWalletSplitted = (_truthyValue) => {
        setIsWalletSplitted(_truthyValue);
    }

    const saveSmartWalletAddress = (_address) => {
        setSmartWalletAddress(_address);
    };

    const setLoadingState = (_isloading) => {
        setLoading(_isloading);
    };

    const saveBalance = (_bal) => {
        setBalance(_bal);
    };


    const triggerNavReload = (_switch) => {
        setNavReload(_switch);
    };



    return {
        allocations,
        setAllocationData,
        isWalletSplitted,
        assignIsWalletSplitted,
        address,
        saveSmartWalletAddress,
        loading,
        setLoadingState,
        balance,
        saveBalance,
        reloadSwitch,
        triggerNavReload,
        splitFormState,
        setSplitFormState
    };
}

const Global = createContainer(useData);

export default Global;