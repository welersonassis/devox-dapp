import React, { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { contractAddress, contractAbi } from "../utils/contract";

const Home: React.FC = () => {
  const { isConnected } = useAccount();

  const [pollName, setPollName] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [maxVotes, setMaxVotes] = useState<string>("");
  const [pollTime, setPollTime] = useState<string>("");

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

  // Function to handle poll creation (updated validation)
  const handleCreatePoll = () => {
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!pollName.trim()) {
      alert("Please enter a poll title.");
      return;
    }
    const validOptions = options.filter((option) => option.trim() !== "");
    if (validOptions.length < 2) {
      alert("Please provide at least two choices.");
      return;
    }
    if (!maxVotes && !pollTime) {
      alert("Please set a maximum number of votes or a poll duration.");
      return;
    }

    // Parse values, fallback to 0n if not set
    const maxVotesValue = maxVotes ? BigInt(maxVotes) : 0n;
    const pollTimeValue = pollTime ? BigInt(pollTime) : 0n;

    writeContract({
      abi: contractAbi,
      address: contractAddress,
      functionName: "createPoll",
      args: [pollName, options, maxVotesValue, pollTimeValue],
    });
    setPollName("");
    setOptions(["", ""]);
    setMaxVotes("");
    setPollTime("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center font-sans">
      <div className="bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-200 mt-2">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center tracking-tight">
          Launch a New Poll
        </h1>
        <p className="text-lg text-gray-500 mb-10 text-center">
          Gather opinions with style. Set your poll’s details and invite the
          world to vote.
        </p>
        <form
          className="flex flex-col gap-10"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreatePoll();
          }}
        >
          <div className="flex flex-wrap gap-8 items-end justify-between">
            {/* Poll Title */}
            <div className="flex flex-col flex-1 min-w-[220px]">
              <label
                htmlFor="pollName"
                className="block text-gray-700 text-base font-semibold mb-2"
              >
                Poll Title
              </label>
              <input
                type="text"
                id="pollName"
                value={pollName}
                onChange={(e) => setPollName(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-5 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200 shadow-sm"
                placeholder="e.g., What's the best JS framework?"
              />
            </div>
            {/* Max Votes */}
            <div className="flex flex-col w-48">
              <label
                htmlFor="maxVotes"
                className="block text-gray-700 text-base font-semibold mb-2"
              >
                Max Votes Allowed
              </label>
              <input
                type="number"
                id="maxVotes"
                min="1"
                value={maxVotes}
                onChange={(e) => setMaxVotes(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-5 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200 shadow-sm"
                placeholder="e.g., 100"
              />
            </div>
            {/* Poll Duration */}
            <div className="flex flex-col w-56">
              <label
                htmlFor="pollTime"
                className="block text-gray-700 text-base font-semibold mb-2"
              >
                Poll Duration (seconds)
              </label>
              <input
                type="number"
                id="pollTime"
                min="1"
                value={pollTime}
                onChange={(e) => setPollTime(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-5 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200 shadow-sm"
                placeholder="e.g., 3600"
              />
            </div>
          </div>
          {/* Voting Choices */}
          <div>
            <label className="block text-gray-700 text-base font-semibold mb-4">
              Choices
            </label>
            <div className="flex flex-wrap gap-4">
              {options.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl py-3 px-5 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition duration-200 shadow-sm mr-2"
                    placeholder={`Choice ${index + 1}`}
                  />
                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-sm flex-shrink-0"
                      title="Remove choice"
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
                type="button"
                onClick={addOption}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-md mt-2"
              >
                + Add Choice
              </button>
            </div>
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={!isConnected}
              className={`w-full font-bold py-4 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-lg text-lg tracking-wide
                ${
                  isConnected
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white focus:ring-purple-500"
                    : "bg-gray-300 text-gray-400 cursor-not-allowed"
                }`}
            >
              Launch Poll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
