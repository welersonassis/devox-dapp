import React from "react";
import { Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../config";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Polls from "./pages/Polls";
import "./App.css";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
