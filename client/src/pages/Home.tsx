import React, { useState } from "react";
import { WagmiProvider, useConnect, useAccount, useWriteContract } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../../config";
import { contractAddress, contractAbi } from "../utils/contract";

// Create a query client for Wagmi's internal use
const queryClient = new QueryClient();

// Main PollCreator component
const PollCreator: React.FC = () => {
  const { connect, connectors } = useConnect();
  const { address, isConnected, isDisconnected } = useAccount();

  const [pollName, setPollName] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]); // Start with two empty options

  const { writeContract } = useWriteContract();

  // Function to add a new voting option
  const addOption = () => {
    setOptions([...options, ""]);
  };

  // Function to remove a voting option
  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // Function to handle changes in option input fields
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Function to handle poll creation (placeholder for now)
  const handleCreatePoll = () => {
    if (!isConnected) {
      alert("Please connect to MetaMask first."); // Using alert for simplicity, consider a custom modal in a real app
      return;
    }
    if (!pollName.trim()) {
      alert("Please enter a poll name.");
      return;
    }
    const validOptions = options.filter((option) => option.trim() !== "");
    if (validOptions.length < 2) {
      alert("Please provide at least two valid voting options.");
      return;
    }

    console.log("Creating Poll:", {
      name: pollName,
      options: validOptions,
      creatorAddress: address,
    });

    writeContract({
      abi: contractAbi,
      address: contractAddress,
      functionName: "createPoll",
      args: [pollName, options, 10n, 0n],
    });
    setPollName("");
    setOptions(["", ""]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Your Poll
        </h1>

        {/* MetaMask Connection Section */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">
            MetaMask Connection
          </h2>
          {isConnected ? (
            <div className="text-green-600 font-medium">
              Connected:{" "}
              <span className="font-mono text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
          ) : (
            <button
              onClick={() => connect({ connector: connectors[0] })} // Connect using the first available connector (injected)
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-md"
            >
              Connect MetaMask
            </button>
          )}
          {isDisconnected && (
            <p className="text-red-500 text-sm mt-2 text-center">
              Wallet disconnected. Please connect.
            </p>
          )}
        </div>

        {/* Poll Creation Form */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="pollName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Poll Name:
            </label>
            <input
              type="text"
              id="pollName"
              value={pollName}
              onChange={(e) => setPollName(e.target.value)}
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="e.g., Best Programming Language"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Voting Options:
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center mb-3">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 mr-2"
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 1 && ( // Allow removing if more than one option
                  <button
                    onClick={() => removeOption(index)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-sm flex-shrink-0"
                    title="Remove option"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addOption}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-md mt-2"
            >
              Add Option
            </button>
          </div>

          <button
            onClick={handleCreatePoll}
            disabled={!isConnected} // Disable if not connected to MetaMask
            className={`w-full font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-md
              ${
                isConnected
                  ? "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
          >
            Create Poll
          </button>
        </div>
      </div>
    </div>
  );
};

// Home component to wrap PollCreator with WagmiProvider and QueryClientProvider
const Home: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <PollCreator />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Home;
