import { padAddress } from '@/utils/utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ECDSAProvider, getRPCProviderOwner } from '@zerodev/sdk';
import { Web3Auth } from "@web3auth/modal";
import { useState} from 'react';
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";
import { ADAPTER_EVENTS, WALLET_ADAPTERS } from "@web3auth/base";
import { useContainer } from 'unstated-next';
import Global from '@/state/global';

const CustomRainbowkitBtn = (props) => {

  const [loginModal, toggleLoginModal] = useState(false);
  const {isConnectedTraditionalLogin, setIsConnectedTradLogin, web3auth, setWeb3Auth} = useContainer(Global);

  // useEffect(() => {
    
  // }, [])
  


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

  const handleLogout = async () => {
    await web3auth.logout();
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected && !isConnectedTraditionalLogin) {
                return (
                  <button style={{padding: 0}} onClick={() => toggleLoginModal(!loginModal)} type="button">
                    <p style={{margin: 0, padding: '13px'}}>Connect Wallet</p>
                    {loginModal && 
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position:'absolute', backgroundColor: 'white', color: 'black',  boxShadow: '2px 13px 50px 3px rgba(0,0,0,0.1)'}}>
                         <p onClick={onTraditionalLogin} style={{ padding: '10px 33px'}}>Traditional Login</p>
                         <div style={{width: '100%', backgroundColor: 'black', height:'0.5px'}}></div>
                         <p onClick={openConnectModal} style={{ padding: '10px 33px'}}>Enhanced Login</p>
                         <div style={{width: '100%', backgroundColor: 'black', height:'0.5px'}}></div>
                         <p onClick={handleLogout} style={{color: 'red'}}>Logout</p>
                       </div>
                    }
                   
                  </button>
                );
              }

              if (chain && chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                  >
                    {chain && chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain && chain.name}
                  </button>

                  <button onClick={openAccountModal} type="button">
                    {padAddress(props.swAddress)}
                    {props.balance
                      ? ` (${props.balance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default CustomRainbowkitBtn;