// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "hardhat/console.sol";

/// @title Decentralize Poll
/// @author Welerson Assis
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects

contract Devox {
    event PollCreated(string name, address creator, uint256 pollId);
    event VoteCast(uint256 pollId, address user, uint256 optionIndex);
    error Devox__AddressAlreadyVoted();
    error Devox__PollNameCanNotBeEmpty();
    error Devox__MustHaveAtLeastTwoOptions();
    error Devox__InvalidOptionId();
    error Devox__PollIsNotActive();
    error Devox__VotesLimitReach();
    error Devox__DurationThresholdReach();

    struct VoterStatus {
        bool hasVoted;
        uint256 chosenOptionIndex;
    }

    struct Option {
        uint256 id;
        string description;
        uint256 voteCount;
    }

    struct Poll {
        uint256 id;
        string name;
        uint256 voteCount;
        uint256 numMaxVotes;
        uint256 maxDuration;
        Option[] options;
        address creator;
        bool isActive;
        uint256 totalVotesCast;
        uint256 createdAt;
    }

    mapping(uint256 => mapping(address => VoterStatus)) public s_voters;
    Poll[] public s_polls;

    /// @notice Create a Poll
    /// @param _name Poll name
    /// @param _optionDescriptions Options to vote
    /// @param _numMaxVotes Maximum number of votes
    /// @param _maxDuration Maximum duration
    /// @return pollId Poll identifier
    function createPoll(
        string memory _name,
        string[] memory _optionDescriptions,
        uint256 _numMaxVotes,
        uint256 _maxDuration
    ) public returns (uint256 pollId) {
        if (bytes(_name).length <= 0) {
            revert Devox__PollNameCanNotBeEmpty();
        }
        if (_optionDescriptions.length < 2) {
            revert Devox__MustHaveAtLeastTwoOptions();
        }

        Option[] memory pollOptions = new Option[](_optionDescriptions.length);
        for (uint256 i = 0; i < _optionDescriptions.length; i++) {
            pollOptions[i] = (
                Option({
                    id: i,
                    description: _optionDescriptions[i],
                    voteCount: 0
                })
            );
        }

        uint256 creationTime = block.timestamp;

        pollId = s_polls.length;
        s_polls.push(
            Poll(
                pollId,
                _name,
                0,
                _numMaxVotes,
                _maxDuration,
                pollOptions,
                msg.sender,
                true,
                0,
                creationTime
            )
        );

        emit PollCreated(_name, msg.sender, pollId);
        return pollId;
    }

    /// @notice Vote function
    /// @param _pollId Poll identifier
    /// @param _optionId Poll option identifier
    function vote(uint256 _pollId, uint256 _optionId) public {
        if (s_voters[_pollId][msg.sender].hasVoted) {
            revert Devox__AddressAlreadyVoted();
        }
        Poll storage poll = s_polls[_pollId];
        if (!poll.isActive) {
            revert Devox__PollIsNotActive();
        }
        if (_optionId >= poll.options.length) {
            revert Devox__InvalidOptionId();
        }
        if (poll.totalVotesCast >= poll.numMaxVotes) {
            poll.isActive = false;
            revert Devox__VotesLimitReach();
        }
        uint256 currentTime = block.timestamp;
        if ((currentTime - poll.createdAt) > poll.maxDuration) {
            poll.isActive = false;
            revert Devox__DurationThresholdReach();
        }

        s_voters[_pollId][msg.sender] = VoterStatus(true, _optionId);
        poll.options[_optionId].voteCount++;
        poll.totalVotesCast++;

        emit VoteCast(_pollId, msg.sender, _optionId);
    }

    /// @notice Retrieve all polls created
    /// @return s_polls Polls array
    function getPolls() public view returns (Poll[] memory) {
        return s_polls;
    }
}
