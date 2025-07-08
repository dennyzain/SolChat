import Hero from "./modules/main/Hero";
import Features from "./modules/main/Features";
import Navbar from "./modules/main/Navbar";
import ChatGlobal from "./modules/chat/ChatGlobal";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo } from "react";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { AuthProvider } from "./contexts/authProvider";
import Footer from "./modules/main/Footer";



function App() {
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new TorusWalletAdapter()], [])
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  return (

    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AuthProvider>
            <Navbar />
            <Hero />
            <Features />
            <ChatGlobal />
            <Footer />
          </AuthProvider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>

  );
}

export default App;
