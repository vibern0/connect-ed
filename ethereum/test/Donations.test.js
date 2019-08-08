const chai = require('chai');

const Accounts = artifacts.require('./Accounts.sol');
const Donations = artifacts.require('./Donations.sol');
chai.should();

contract('Donations', (accounts) => {
    let donationsInstance;
    let accountsInstance;
    const contractOwnerAddress = accounts[0];
    const fakeUserDid = 'did:ethr:0x31486054a6ad2c0b685cd89ce0ba018e210d504e';
    const userAddress = accounts[1];
    const fakeAdminRegionDid = 'did:ethr:0x31486054a6bd2c0b685cd89ce0ba018e210d504f';
    const adminRegionAddress = accounts[2];
    const adminRegionRoleId = 3;
    const fakeRegionId = 1;

    beforeEach(async () => {
        accountsInstance = await Accounts.new({ from: contractOwnerAddress });
        donationsInstance = await Donations.new(accountsInstance.address, { from: contractOwnerAddress });
        accountsInstance.invite(
            fakeAdminRegionDid,
            adminRegionAddress,
            adminRegionRoleId,
            { from: contractOwnerAddress},
        );
        accountsInstance.signup(
            fakeAdminRegionDid,
            adminRegionRoleId,
            { from: adminRegionAddress },
        );
    });

    // set region admin
    it('set region admin', async () => {
        await donationsInstance.setRegionAdmin(fakeRegionId, fakeAdminRegionDid, { from: contractOwnerAddress });
    });

    // send donation

    // send three donations

    // admin region withdraws part of it

    // fails to admin region withdraw more than allowed

    // fails to not admin region try to withdraw

    // failt to set admin user with not signed account

});
