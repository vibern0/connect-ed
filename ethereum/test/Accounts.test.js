const chai = require('chai');

const Accounts = artifacts.require('./Accounts.sol');
chai.should();

contract('Accounts', (accounts) => {
    let accountsInstance;
    const fakeUserDid = 'did:ethr:0x31486054a6ad2c0b685cd89ce0ba018e210d504e';
    beforeEach(async () => {
        accountsInstance = await Accounts.new();
    });

    it('should signup a user', async () => {
        await accountsInstance.signup(fakeUserDid, 1, { from: accounts[0] });
        (await accountsInstance.userExists(fakeUserDid)).should.be.true;
    });

    it('should signup a user from invite', async () => {
        await accountsInstance.invite(fakeUserDid, accounts[1], 2, { from: accounts[0] });
        await accountsInstance.signup(fakeUserDid, 2, { from: accounts[1] });
        (await accountsInstance.userExists(fakeUserDid)).should.be.true;
    });

    // user should not existe without sigup

    // fail to invite not from owner

    // fail to add to special role without invite

    // fail to signup when using a different address from invite

});
