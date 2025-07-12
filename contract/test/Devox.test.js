const { expect } = require("chai");
const hre = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Devox Contract", function () {
  async function deployDevoxFixture() {
    const Devox = await hre.ethers.getContractFactory("Devox");
    const devox = await Devox.deploy();
    const [owner, addr1] = await hre.ethers.getSigners();
    return { devox, owner, addr1 };
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

  it("Should fail if poll name is empty", async function() {
    const { devox } = await loadFixture(deployDevoxFixture);
    const options = ["Option 1", "Option 2"];
    await expect(devox.createPoll("", options, 10, 0)).to.be.revertedWithCustomError(
      devox,
      "Devox__PollNameCanNotBeEmpty"
    );
  });

   it("Should fail if there are less than two options", async function() {
    const { devox } = await loadFixture(deployDevoxFixture);
    const options = ["Only one option"];
     await expect(devox.createPoll("A Poll", options, 10, 0)).to.be.revertedWithCustomError(
      devox,
      "Devox__MustHaveAtLeastTwoOptions"
    );
  });
});
