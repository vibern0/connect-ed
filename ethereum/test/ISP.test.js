const chai = require('chai');

const ISP = artifacts.require('./ISP.sol');
chai.should();

contract('ISP', (accounts) => {
    let ispInstance;
    let accountsInstance;
    const contractOwnerAddress = accounts[0];
    const fakeUserDid = 'did:ethr:0x31486054a6ad2c0b685cd89ce0ba018e210d504e';
    const userAddress = accounts[1];
    const fakeISPDid = 'did:ethr:0x31486054a6bd2c0b685cd89ce0ba018e210d504f';
    const ispAddress = accounts[2];
    const ispRoleId = 2;
    const fakeRegionId = 1;

    beforeEach(async () => {
        accountsInstance = await Accounts.new({ from: contractOwnerAddress });
        ispInstance = await ISP.new(accountsInstance.address, { from: contractOwnerAddress });
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

    // set a region isp
    it('set region isp', async () => {
        await donationsInstance.setRegionAdmin(fakeRegionId, fakeAdminRegionDid, { from: contractOwnerAddress });
    });

    // upload data with region isp

    // upload many region data and load it

    // fails to upload data with invalid account

    // fails to upload data woth account that is not isp

});
