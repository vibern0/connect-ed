const chai = require('chai');

const Accounts = artifacts.require('./Accounts.sol');
const ISP = artifacts.require('./ISP.sol');

chai.should();

contract('ISP', (accounts) => {
    let accountsInstance;
    let ispInstance;
    const contractOwnerAddress = accounts[0];
    const fakeUserDid = 'did:ethr:0x31486054a6ad2c0b685cd89ce0ba018e210d504e';
    const userAddress = accounts[1];
    const anotherUserAddress = accounts[2];
    const someOtherUserAddress = accounts[3];
    const fakeISPRegionDid = 'did:ethr:0x31486054a6bd2c0b685cd89ce0ba018e210d504f';
    const ispRegionAddress = accounts[4];
    const ispRegionRoleId = 2;
    const fakeRegionId = 1;
    const networkGasPrice = 20000000000;

    beforeEach(async () => {
        accountsInstance = await Accounts.new({ from: contractOwnerAddress });
        ispInstance = await ISP.new(accountsInstance.address, { from: contractOwnerAddress });
        await accountsInstance.invite(
            fakeISPRegionDid,
            ispRegionAddress,
            ispRegionRoleId,
            { from: contractOwnerAddress },
        );
        await accountsInstance.signup(
            fakeISPRegionDid,
            { from: ispRegionAddress },
        );
    });

    // set a region isp
    it('set region isp', async () => {
        await ispInstance.setRegionISP(fakeRegionId, fakeISPRegionDid, { from: contractOwnerAddress });
        const newRegionISP = await ispInstance.getRegionISP(fakeRegionId, { from: userAddress });
        newRegionISP.should.be.equal(ispRegionAddress);
    });

    // upload data with region isp

    // upload many region data and load it

    // fails to upload data with invalid account

    // fails to upload data woth account that is not isp

});
