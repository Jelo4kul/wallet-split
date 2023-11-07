import { Raleway } from 'next/font/google'
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { configureChains, mainnet, WagmiConfig, createConfig, } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import WagmiWrapper from '@/components/WagmiWrapper';
import dotenv from 'dotenv';
import NavBar from '@/components/navbar/nav';

const raleway = Raleway({ subsets: ['latin'] })

export const metadata = {
  title: 'Wallet Split',
  description: 'The best tool for splitting your wallets and managing your money better',
}

dotenv.config();
export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={raleway.className}>
        <WagmiWrapper>
          <NavBar />
          {children}
        </WagmiWrapper>
      </body>
    </html>
  )
}

