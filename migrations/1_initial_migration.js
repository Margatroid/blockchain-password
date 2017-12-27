var Migrations = artifacts.require("./Migrations.sol");
var BlockchainPassword = artifacts.require("./BlockchainPassword.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(BlockchainPassword);
};
