import { useReadContract, useAccount } from "wagmi";
import { contractAddress, contractAbi } from "../utils/contract";

function Test() {
  const { isConnected } = useAccount();

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

  if (!isConnected) {
    return <div>Please connect your wallet.</div>;
  }

  if (isLoading) {
    return <div>Loading polls...</div>;
  }

  if (isError) {
    return <div>Error fetching polls: {error?.message}</div>;
  }

  if (!polls || polls.length === 0) {
    return <div>No polls found.</div>;
  }

  return (
    <div>
      <h2>Polls</h2>
      <ul>
        {polls.map((poll, index) => (
          <li key={index}>{JSON.stringify(poll)}</li>
        ))}
      </ul>
    </div>
  );
}

export default Test;
