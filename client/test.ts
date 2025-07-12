import { createPublicClient, http } from "viem";
import { wagmiContractConfig } from "./src/utils/contract"; // adjust if needed

const client = createPublicClient({
  chain: {
    id: 31337,
    name: "Hardhat",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: ["http://127.0.0.1:8545"] },
    },
  },
  transport: http("http://127.0.0.1:8545"), // 👈 explicitly set the working RPC URL
});

async function main() {
  const polls = await client.readContract({
    ...wagmiContractConfig,
    functionName: "getPolls",
  });

  console.dir(polls, { depth: null });
}

main();