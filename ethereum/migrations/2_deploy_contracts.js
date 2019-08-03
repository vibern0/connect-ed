const Accounts = artifacts.require('./Accounts.sol');

module.exports = (deployer) => {
    deployer.deploy(Accounts);
};
