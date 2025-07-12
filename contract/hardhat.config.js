require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
// hardhat.config.js
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      viaIR: true,
    },
  },
};
