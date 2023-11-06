import { createContainer } from 'unstated-next';
import { useState } from 'react';
function useData() {
    const [address, setSmartWalletAddress] = useState('');
    const [isWalletSplitted, setIsWalletSplitted] = useState(false);
    const [allocations, setAllocations] = useState({
        fnf: '0',
        miscellaneous: '0',
        nfts: '0',
        fnfAddresses: []
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

    return { allocations, setAllocationData, isWalletSplitted, assignIsWalletSplitted, address, saveSmartWalletAddress };
}

const Global = createContainer(useData);

export default Global;