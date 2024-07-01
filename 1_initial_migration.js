const Voting = artifacts.require("Voting");

module.exports = function(deployer) {
  const votingPeriod = 60 * 60 * 24; // 1 day in seconds
  deployer.deploy(Voting, votingPeriod);
};
