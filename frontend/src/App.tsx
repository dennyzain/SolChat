import Hero from "./modules/main/Hero";
import Features from "./modules/main/Features";
import Navbar from "./modules/main/Navbar";
import ChatGlobal from "./modules/chat/ChatGlobalContainer";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo } from "react";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import Footer from "./modules/main/Footer";
import { Toaster } from "./components/ui/sonner";



function App() {
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new TorusWalletAdapter()], [])
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Navbar />
          <Hero />
          <Features />
          <ChatGlobal />
          <Footer />
          <Toaster />
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

export default App;
