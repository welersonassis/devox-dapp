import React from "react";
import { Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../config";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Polls from "./pages/Polls";
import "./App.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const { wallets } = getDefaultWallets({
  appName: "Devox",
  projectId,
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider
          chains={config.chains}
          wallets={wallets}
          projectId={projectId}
        >
          <div className="min-h-screen bg-gray-100 font-sans">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/polls" element={<Polls />} />
                <Route path="*" element={<div>404 Not Found</div>} />
              </Routes>
            </main>
          </div>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};

export default App;
