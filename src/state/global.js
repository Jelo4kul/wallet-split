import { createContainer } from 'unstated-next';
import { useState } from 'react';
function useData() {
    // const [address, setSmartWalletAddress] = useState('');
    // const [owner, setOwner] = useState(null);
    // const [ecdsaProvider, setEcdsaProvider] = useState(null);
    const [allocations, setAllocations] = useState({
        fnf: '',
        miscellaneous: '',
        nfts: '',
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

    // const setAddress = (_addr) => {
    //     setSmartWalletAddress(_addr);
    // };

    // const setOwnerObject = (_owner) => {
    //     setOwner(_owner);
    // }

    // const setEcdsaProviderObj = (_provider) => {
    //     setEcdsaProvider(_provider);
    // }

    return { allocations, setAllocationData };
}

const Global = createContainer(useData);

export default Global;