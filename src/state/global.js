import { createContainer } from 'unstated-next';
import { useState } from 'react';
function useData() {
    // const [address, setSmartWalletAddress] = useState('');
    // const [owner, setOwner] = useState(null);
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
    };

    return { allocations, setAllocationData, isWalletSplitted, assignIsWalletSplitted };
}

const Global = createContainer(useData);

export default Global;