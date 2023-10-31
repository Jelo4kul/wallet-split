import { createContainer } from 'unstated-next';
import { useState } from 'react';
function useAddress() {
    const [address, setSmartWalletAddress] = useState('');
    const [owner, setOwner] = useState(null);
    const [ecdsaProvider, setEcdsaProvider] = useState(null);

    const setAddress = (_addr) => {
        setSmartWalletAddress(_addr);
    };

    const setOwnerObject = (_owner) => {
        setOwner(_owner);
    }

    const setEcdsaProviderObj = (_provider) => {
        setEcdsaProvider(_provider);
    }

    return { address, setAddress, owner, setOwnerObject, ecdsaProvider, setEcdsaProviderObj };
}

const Global = createContainer(useAddress);

export default Global;