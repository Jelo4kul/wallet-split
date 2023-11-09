import React from 'react';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import { sepolia } from 'viem/chains';
import { createPublicClient, http } from 'viem';
import { useRouter } from 'next/navigation';
import styles from './getStartedButton.module.css';

const GetStartedButton = ({ isConnected }) => {

    const router = useRouter();
    const transport = http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);

    const publicClient = createPublicClient({
        chain: sepolia,
        transport,
    });

    const { assignIsWalletSplitted, address: swAddress, allocations } = useContainer(Global);
    

    const handleClick = async () => {
       
        if(isConnected) {
            //if it's a new smart wallet
            if(allocations.fnf == 0 && allocations.miscellaneous==0 && allocations.nfts == 0) {
                assignIsWalletSplitted(false);
                router.push('/splitWallet');
            } else {
                router.push("/dashboard");
            }
        } else {
            router.push("/createWallet"); 
        }
    };

  return (
    <button onClick={handleClick} className={styles.gtStrtdButton}>Get Started</button>
  )
}

export default GetStartedButton