// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "hardhat/console.sol";

contract Devox {
    event PollCreated(string name, address creator, uint256 pollId);
    error Devox__AddressAlreadyVoted();
    error Devox__PollNameCanNotBeEmpty();
    error Devox__MustHaveAtLeastTwoOptions();
    error Devox__InvalidOptionId();

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
        uint256 maxCount;
        uint256 maxTime;
        Option[] options;
        address creator;
        bool isActive;
        uint256 totalVotesCast;
    }

    mapping(uint256 => mapping(address => VoterStatus)) public s_voters;
    Poll[] public s_polls;

    function createPoll(
        string memory _name,
        string[] memory _optionDescriptions,
        uint256 _maxCount,
        uint256 _maxTime
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

        pollId = s_polls.length;
        s_polls.push(
            Poll(
                pollId,
                _name,
                0,
                _maxCount,
                _maxTime,
                pollOptions,
                msg.sender,
                true,
                0
            )
        );

        emit PollCreated(_name, msg.sender, pollId);
        return pollId;
    }

    function vote(uint256 _pollId, uint256 _optionId) public {
        if (s_voters[_pollId][msg.sender].hasVoted) {
            revert Devox__AddressAlreadyVoted();
        }
        Poll storage poll = s_polls[_pollId];
        if (_optionId >= poll.options.length) {
            revert Devox__InvalidOptionId();
        }

        s_voters[_pollId][msg.sender] = VoterStatus(true, _optionId);
        poll.options[_optionId].voteCount++;
        poll.totalVotesCast++;
    }

    function getPolls() public view returns (Poll[] memory) {
        return s_polls;
    }
}
