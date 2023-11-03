'use client';
import React, { useState, useEffect } from 'react';
import styles from './layout.module.css';
import Link from 'next/link';
import Image from 'next/image';

const DashboardLayout = ({ children }) => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
        console.log(windowWidth)
      };

      useEffect(() => {
        // Add a resize event listener when the component mounts
        window.addEventListener('resize', handleResize);
    
        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []); // Empty dependency array to run the effect only once when the component mounts
    
      useEffect(() => {
        setWindowWidth(window.innerWidth);
        console.log(windowWidth)
      }, [windowWidth]); 
    

  return (
    <div className={styles.layout}>
        <section className={styles.left}>
            <nav className={styles.verticalNav}>
                <ul>
                    <li>
                        <Image 
                            src="/wallet-dashboard.svg"
                            width={20}
                            height={20}
                            alt="wallet overview"
                         />
                        <Link href='/dashboard' className={styles.NavMenu}>{windowWidth < 460 ? 'Wallet' : 'Wallet Overview'}</Link>
                    </li>
                    <li>
                        <Image 
                            src="/fnf.svg"
                            width={20}
                            height={20}
                            alt="Family and Friends"
                        />
                        <Link href='/dashboard/familyNfriends' className={styles.NavMenu}>{windowWidth < 460 ? 'F.n.F' : 'Family and Friends'}</Link>
                    </li>
                    <li>
                        <Image 
                            src="/miscellaneous.svg"
                            width={20}
                            height={20}
                            alt="Miscellaneous"
                        />
                        <Link href='/dashboard/miscellaneous' className={styles.NavMenu}>{windowWidth < 460 ? 'Misc' : 'Miscellaneous'}</Link>
                    </li>
                    <li>
                        <Image 
                            src="/nfts.svg"
                            width={20}
                            height={20}
                            alt="NFTs"
                         />
                        <Link href='/dashboard/nfts' className={styles.NavMenu}>NFTs</Link>
                    </li>
                </ul>
            </nav>
        </section>
        <section className={styles.right}>{children}</section>
    </div>

  )
}

export default DashboardLayout