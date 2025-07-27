const { expect } = require("chai");
const hre = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Devox Contract", function () {
  async function deployDevoxFixture() {
    const Devox = await hre.ethers.getContractFactory("Devox");
    const devox = await Devox.deploy();
    const [owner, addr1, addr2, addr3] = await hre.ethers.getSigners();
    return { devox, owner, addr1, addr2, addr3 };
  }

  async function createPoll(devox, creator, overrides = {}) {
    const pollName = overrides.pollName || "Best stable coin ?";
    const options = overrides.options || ["USDT", "USDC", "USDe"];
    const pollTimeDuration = overrides.pollTimeDuration || 100;
    const numMaxVotes = overrides.numMaxVotes || 100;

    const tx = await devox.connect(creator).createPoll(pollName, options, numMaxVotes, pollTimeDuration);
    await tx.wait();

    const pollId = 0; // The first one has the ID = 0

    return { pollId, pollName, options, pollTimeDuration, numMaxVotes }

  }

  it("Should create a poll successfully and emit an event", async function () {
    const { devox, owner } = await loadFixture(deployDevoxFixture);

    const pollName = "Best Web3 Framework";
    const options = ["Hardhat", "Foundry", "Truffle"];
    const pollId = 0; // The first poll will have ID 0

    // We check that the 'PollCreated' event is emitted from the 'devox' contract
    // with the correct arguments.
    await expect(devox.createPoll(pollName, options, 10, 0))
      .to.emit(devox, "PollCreated")
      .withArgs(pollName, owner.address, pollId);

    // Verify the state was updated correctly
    const polls = await devox.getPolls();
    expect(polls.length).to.equal(1);
    expect(polls[0].name).to.equal(pollName);
    expect(polls[0].options.length).to.equal(3);
  });

  it("Should fail if poll name is empty", async function () {
    const { devox } = await loadFixture(deployDevoxFixture);
    const options = ["Option 1", "Option 2"];
    await expect(devox.createPoll("", options, 10, 0)).to.be.revertedWithCustomError(
      devox,
      "Devox__PollNameCanNotBeEmpty"
    );
  });

  it("Should fail if there are less than two options", async function () {
    const { devox } = await loadFixture(deployDevoxFixture);
    const options = ["Only one option"];
    await expect(devox.createPoll("A Poll", options, 10, 0)).to.be.revertedWithCustomError(
      devox,
      "Devox__MustHaveAtLeastTwoOptions"
    );
  });

  it("Should allow voting in a existing poll", async function () {
    const { devox, addr1 } = await loadFixture(deployDevoxFixture);

    const { pollId } = await createPoll(devox, addr1);
    const OPTION_INDEX = 1;

    await expect(devox.connect(addr1).vote(pollId, OPTION_INDEX)).to.emit(devox, "VoteCast").withArgs(pollId, addr1.address, OPTION_INDEX);
  });

  it("Should fail if voting in a nonexistent poll option", async function () {
    const { devox, addr1 } = await loadFixture(deployDevoxFixture);
    const { pollId } = await createPoll(devox, addr1);
    const OPTION_INDEX = 10; // Nonexistent poll option because only exist ["USDT", "USDC", "USDe"]

    await expect(devox.connect(addr1).vote(pollId, OPTION_INDEX)).to.be.revertedWithCustomError(
      devox,
      "Devox__InvalidOptionId"
    );
  });

  it("Should fail if the maximum number of votes was reached", async function () {
    const { devox , addr1, addr2, addr3 } = await loadFixture(deployDevoxFixture);
    const { pollId } = await createPoll(devox, addr1, {numMaxVotes: 2});
    const OPTION_INDEX = 1;

    await devox.connect(addr1).vote(pollId, OPTION_INDEX);
    await devox.connect(addr2).vote(pollId, OPTION_INDEX);

    await expect(devox.connect(addr3).vote(pollId, OPTION_INDEX)).to.be.revertedWithCustomError(
      devox,
      "Devox__VotesLimitReach"
    )
  });

  it("Should fail if the duration threshold was reached", async function() {
    const { devox, addr1} = await loadFixture(deployDevoxFixture);
    const { pollId } = await createPoll(devox, addr1, {pollTimeDuration: 1});
    const OPTION_INDEX = 1;

    // Advance the blockchain time by more than the pollTimeDuration (e.g., 2 seconds).
    await hre.network.provider.send("evm_increaseTime", [2]);
    // Mine a new block to apply the time change to block.timestamp.
    await hre.network.provider.send("evm_mine"); 

    await expect(devox.connect(addr1).vote(pollId, OPTION_INDEX)).to.be.revertedWithCustomError(
      devox,
      "Devox__DurationThresholdReach"
    )
  });



});
