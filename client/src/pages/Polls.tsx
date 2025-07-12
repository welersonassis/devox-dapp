import React, { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { contractAddress, contractAbi } from "../utils/contract";

interface PollOption {
  id: bigint;
  description: string;
  voteCount: bigint;
}

// Define the structure for a Poll object
interface Poll {
  id: bigint;
  creator: string;
  isActive: boolean;
  maxCount: bigint;
  maxTime: bigint;
  name: string;
  creatorAddress: string;
  options: PollOption[];
  totalVotesCast: bigint;
  voteCount: bigint;
}

const Polls: React.FC = () => {
  const { isConnected } = useAccount();
  // State to keep track of which poll card is expanded
  const [expandedPollId, setExpandedPollId] = useState<string | null>(null);
  // State to keep track of the selected option for voting
  const [selectedOption, setSelectedOption] = useState<{
    pollId: string;
    optionId: string;
  } | null>(null);

  const {
    data: polls,
    isLoading,
    isError,
    error,
  } = useReadContract({
    abi: contractAbi,
    address: contractAddress,
    functionName: "getPolls",
  });

  const Polls: Poll[] = (polls || []) as Poll[];

  // Function to toggle the expanded state of a poll card
  const toggleExpand = (pollId: string) => {
    setExpandedPollId(expandedPollId === pollId ? null : pollId);
    setSelectedOption(null); // Reset selected option when expanding/collapsing
  };

  // Function to handle voting (placeholder)
  const handleVote = (pollId: string, optionId: string) => {
    if (!isConnected) {
      alert("Please connect your MetaMask wallet to vote.");
      return;
    }
    if (
      !selectedOption ||
      selectedOption.pollId !== pollId ||
      selectedOption.optionId !== optionId
    ) {
      alert("Please select an option to vote.");
      return;
    }
    console.log(`Voting for Poll ID: ${pollId}, Option ID: ${optionId}`);
    alert(
      `Your vote for "${selectedOption.optionId}" in poll "${pollId}" has been cast! (Simulated)`
    );
    // In a real DApp, you would send a transaction to a smart contract here.
    // After voting, you might want to collapse the card or show a confirmation.
    setExpandedPollId(null); // Collapse the card after voting
    setSelectedOption(null); // Clear selected option
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Active Polls
        </h1>
        <button
          //   onClick={() => navigateTo("create")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-md mb-6"
        >
          ← Back to Create Poll
        </button>

        {/* Conditional rendering for loading state */}
        {isLoading && (
          <p className="text-center text-gray-600">
            Loading polls from blockchain...
          </p>
        )}

        {/* Conditional rendering for error state */}
        {isError && (
          <p className="text-center text-red-600">
            Error loading polls: {error?.message}
          </p>
        )}

        {!isLoading && !isError && (
          <div className="space-y-6">
            {Polls.length === 0 ? (
              <p className="text-center text-gray-600">
                No active polls found.
              </p>
            ) : (
              Polls.map((poll) => (
                <div
                  key={poll.id}
                  className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg"
                  onClick={() => toggleExpand(poll.id.toString())}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {poll.name}
                    </h2>
                    <span className="text-gray-500 text-sm">
                      {expandedPollId === poll.id.toString() ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 transform rotate-180"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </span>
                  </div>

                  {expandedPollId === poll.id.toString() && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-600 text-sm mb-3">
                        Created by:{" "}
                        <span className="font-mono">
                          {poll.creatorAddress.slice(0, 6)}...
                          {poll.creatorAddress.slice(-4)}
                        </span>
                      </p>
                      <h3 className="text-lg font-medium text-gray-700 mb-3">
                        Vote Options:
                      </h3>
                      <div className="space-y-2">
                        {poll.options.map((option) => (
                          <label
                            key={option.id.toString()}
                            className="flex items-center p-3 rounded-lg border border-gray-300 hover:bg-blue-50 transition duration-200 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`vote-poll-${poll.id}`}
                              value={option.id.toString()}
                              checked={
                                selectedOption?.pollId === poll.id.toString() &&
                                selectedOption?.optionId ===
                                  option.id.toString()
                              }
                              onChange={() =>
                                setSelectedOption({
                                  pollId: poll.id.toString(),
                                  optionId: option.id.toString(),
                                })
                              }
                              className="form-radio h-5 w-5 text-blue-600 mr-3"
                              onClick={(e) => e.stopPropagation()} // Prevent card collapse when clicking radio
                            />
                            <span className="text-gray-800 flex-grow">
                              {option.description}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {option.voteCount} votes
                            </span>
                          </label>
                        ))}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card collapse when clicking vote button
                          if (
                            selectedOption &&
                            selectedOption.pollId === poll.id.toString()
                          ) {
                            handleVote(
                              poll.id.toString(),
                              selectedOption.optionId
                            );
                          } else {
                            alert("Please select an option before voting.");
                          }
                        }}
                        disabled={
                          !isConnected ||
                          !selectedOption ||
                          selectedOption.pollId !== poll.id.toString()
                        }
                        className={`w-full font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-md mt-4
                        ${
                          isConnected &&
                          selectedOption &&
                          selectedOption.pollId === poll.id.toString()
                            ? "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`}
                      >
                        Vote
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Polls;
