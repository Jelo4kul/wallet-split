import React from 'react';
import styles from './layout.module.css';
import Link from 'next/link';
import Image from 'next/image';

const DashboardLayout = ({ children }) => {
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
                        <Link href='/dashboard' className={styles.NavMenu}>Wallet Overview</Link>
                    </li>
                    <li>
                        <Image 
                            src="/fnf.svg"
                            width={20}
                            height={20}
                            alt="Family and Friends"
                        />
                        <Link href='/dashboard/familyNfriends' className={styles.NavMenu}>Family and Friends</Link>
                    </li>
                    <li>
                        <Image 
                            src="/miscellaneous.svg"
                            width={20}
                            height={20}
                            alt="Miscellaneous"
                        />
                        <Link href='/dashboard/miscellaneous' className={styles.NavMenu}>Miscellaneous</Link>
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