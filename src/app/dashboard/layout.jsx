'use client';
import React, { useState, useEffect } from 'react';
import styles from './layout.module.css';
import Link from 'next/link';
import Image from 'next/image';

const DashboardLayout = ({ children }) => {

    const [windowWidth, setWindowWidth] = useState(0);
    const [activeTab, setActiveTab] = useState("dashboard")

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        console.log(windowWidth)
      };

    const handleTabsClicked = (_tabName) => {
        setActiveTab(_tabName);
    }

    useEffect(() => {
    setWindowWidth(window.innerWidth);
    // Add a resize event listener when the component mounts
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
        window.removeEventListener('resize', handleResize);
    };
    }, []); // Empty dependency array to run the effect only once when the component mounts

    return (
        <div className={styles.layout}>
            <section className={styles.left}>
                <nav className={styles.verticalNav}>
                    <ul>
                        <li>
                            <Link onClick={() => handleTabsClicked("dashboard")} 
                                  href='/dashboard' 
                                  className={styles.NavMenu} 
                                  style={activeTab == 'dashboard' ? {fontWeight: 600} : {}}
                            >
                                <Image 
                                    src="/wallet-dashboard.svg"
                                    width={20}
                                    height={20}
                                    alt="wallet overview"
                                />
                                <p >{windowWidth < 460 ? 'Wallet' : 'Wallet Overview'}</p>
                            </Link>
                        </li>
                        <li>
                            <Link onClick={() => handleTabsClicked("familyNfriends")} 
                                  href='/dashboard/familyNfriends' 
                                  className={styles.NavMenu} 
                                  style={activeTab == 'familyNfriends' ? {fontWeight: 600} : {}}>
                                <Image 
                                    src="/fnf.svg"
                                    width={20}
                                    height={20}
                                    alt="Family and Friends"
                                />
                                <p>{windowWidth < 460 ? 'F.n.F' : 'Family and Friends'}</p>
                            </Link>
                        </li>
                        <li>
                            <Link onClick={() => handleTabsClicked("miscellaneous")}  
                                  href='/dashboard/miscellaneous' 
                                  className={styles.NavMenu}
                                  style={activeTab == 'miscellaneous' ? {fontWeight: 600} : {}}
                            >
                                <Image 
                                    src="/miscellaneous.svg"
                                    width={20}
                                    height={20}
                                    alt="Miscellaneous"
                                />
                                <p>{windowWidth < 460 ? 'Misc' : 'Miscellaneous'}</p>
                            </Link>
                        </li>
                        <li>
                            <Link onClick={() => handleTabsClicked("nfts")} 
                                  href='/dashboard/nfts' 
                                  className={styles.NavMenu}
                                  style={activeTab == 'nfts' ? {fontWeight: 600} : {}}
                            >
                                <Image 
                                    src="/nfts.svg"
                                    width={20}
                                    height={20}
                                    alt="NFTs"
                                />
                                <p>NFTs</p>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </section>
            <section className={styles.right}>{children}</section>
        </div>
    )
}

export default DashboardLayout;