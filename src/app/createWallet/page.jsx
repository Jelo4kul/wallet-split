'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useContainer } from 'unstated-next';
import Global from '@/state/global';
import { useAccount, useConnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Web3Auth } from "@web3auth/modal";
import { ADAPTER_EVENTS, WALLET_ADAPTERS } from "@web3auth/base";
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";

const WalletCreation = () => {

 // const [loading, setIsLoading] = useState(false);
  //const [address, setKernelAddress] = useState('');
  const router = useRouter();
  const { isWalletSplitted, assignIsWalletSplitted, isConnectedTraditionalLogin , setIsConnectedTradLogin, setWeb3Auth} = useContainer(Global);
  const {  isConnected } = useAccount();
  

  useEffect(() => {
    //isConnected == true, means user has already created smart wallet
    if(isConnected || isConnectedTraditionalLogin){
      if(isWalletSplitted) {
        router?.push('/dashboard');
      }else {
        router?.push('/splitWallet');
      }
    }
  }, [isConnected, isConnectedTraditionalLogin])

  const { openConnectModal } = useConnectModal();


  const onTraditionalLogin = () => {
    let web3auth;

    const initializeWeb3Auth = async () => {
      // Initialize
      web3auth = new Web3Auth({
        clientId: `${process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID}`, // Get your Client ID from the Web3Auth Dashboard
        web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
        chainConfig: {
          chainNamespace: "eip155",
          chainId: "0xAA36A7",
          rpcTarget: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
          displayName: "Sepolia Testnet",
          blockExplorer: "https://sepolia.etherscan.io",
          ticker: "ETH",
          tickerName: "Ethereum",
        },
        uiConfig: {
          theme: "light",
          loginMethodsOrder: ["google", "twitter"],
          defaultLanguage: "en",
          appLogo: "https://web3auth.io/images/web3auth-logo.svg", // Your App Logo Here
          modalZIndex: "2147483647",
          primaryButton: 'socialLogin',
          appName: name,
        },
      });
  
      await web3auth.initModal(
        {
          modalConfig: {
            [WALLET_ADAPTERS.OPENLOGIN]: {
              label: "openlogin",
              loginMethods: {
                google: {
                  name: "google login",
                  logoDark: "url to your custom logo which will shown in dark mode",
                  showOnModal: true,
                },
                facebook: {
                  showOnModal: false,
                },
                twitter: {
                  showOnModal: false,
                },
                reddit: {
                  showOnModal: false,
                },
                discord: {
                  showOnModal: false,
                },
                twitch: {
                  showOnModal: false,
                },
                apple: {
                  showOnModal: false,
                },
                line: {
                  showOnModal: false,
                },
                github: {
                  showOnModal: false,
                },
                kakao: {
                  showOnModal: false,
                },
                linkedin: {
                  showOnModal: false,
                },
                weibo: {
                  showOnModal: false,
                },
                wechat: {
                  showOnModal: false,
                },
                email_passwordless: {
                  showOnModal: false,
                },
                 // Disable email_passwordless and sms_passwordless
                email_passwordless: {
                  name: "email_passwordless",
                  showOnModal: false,
                },
                sms_passwordless: {
                  name: "sms_passwordless",
                  showOnModal: false,
                },
                
              },
              // setting it to false will hide all social login methods from modal.
             // showOnModal: false,
            },
            [WALLET_ADAPTERS.METAMASK]: {
              showOnModal: false,
            },
            [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
              showOnModal: false,
            },
            [WALLET_ADAPTERS.TORUS_EVM]: {
              showOnModal: false,
            },
           
          

          },
        }
      );
      await web3auth.connect();
      setWeb3Auth(web3auth);

      
    }

    // subscribe to lifecycle events emitted by web3auth
    const subscribeAuthEvents = (web3auth) => {
      // emitted when modal visibility changes.
      web3auth.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (isVisible) => {
        console.log("is modal visible", isVisible);
      });

      web3auth.on(LOGIN_MODAL_EVENTS.LOGIN, (isLoggedIn) => {
        console.log("is Logged in", isLoggedIn);
      });

      web3auth.on(LOGIN_MODAL_EVENTS.DISCONNECT, (isDisconnected) => {
        console.log("is Disconnected", isDisconnected);
      });
      web3auth.on(ADAPTER_EVENTS.CONNECTED, (data) => {
        console.log("connected to wallet", data);
        setIsConnectedTradLogin(true);
        // web3auth.provider will be available here after user is connected
      });
      web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log("connecting");
      });
      web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("disconnected");
      });
      web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.log("error", error);
      });
      web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.log("error", error);
      });
    };

    initializeWeb3Auth();
    subscribeAuthEvents(web3auth);
  }

  return (
    <section className={styles.walletCreation}>
          <Image 
            src="/wallet.svg"
            width={300}
            height={300}
            alt="Split wallet"
          />
          <h1>Create a smart wallet</h1>
          <p className={styles.subHeading}>Creating a smart wallet enables you split your wallet into sub-wallet groups</p>
          {/*<CustomRainbowkitBtn />*/}
          <button onClick={openConnectModal}>Create Wallet</button>
          <button onClick={onTraditionalLogin} className={styles.wallletCreationEmail}>Create Wallet with email</button>
    </section>
  )
}

export default WalletCreation