const Accounts = artifacts.require('./Accounts.sol');
const Donations = artifacts.require('./Donations.sol');
const ISP = artifacts.require('./ISP.sol');

module.exports = async (deployer) => {
    await deployer.deploy(Accounts);
    await deployer.deploy(Donations, Accounts.address);
    await deployer.deploy(ISP, Accounts.address);
};
