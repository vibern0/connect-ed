const chai = require('chai');
const BigNumber = require('bignumber.js');

const Accounts = artifacts.require('./Accounts.sol');
const Donations = artifacts.require('./Donations.sol');
chai.should();

contract('Donations', (accounts) => {
    let donationsInstance;
    let accountsInstance;
    const contractOwnerAddress = accounts[0];
    const fakeUserDid = 'did:ethr:0x31486054a6ad2c0b685cd89ce0ba018e210d504e';
    const userAddress = accounts[1];
    const anotherUserAddress = accounts[2];
    const someOtherUserAddress = accounts[3];
    const fakeAdminRegionDid = 'did:ethr:0x31486054a6bd2c0b685cd89ce0ba018e210d504f';
    const adminRegionAddress = accounts[4];
    const adminRegionRoleId = 3;
    const fakeRegionId = 1;
    const networkGasPrice = 20000000000;

    beforeEach(async () => {
        accountsInstance = await Accounts.new({ from: contractOwnerAddress });
        donationsInstance = await Donations.new(accountsInstance.address, { from: contractOwnerAddress });
        await accountsInstance.invite(
            fakeAdminRegionDid,
            adminRegionAddress,
            adminRegionRoleId,
            { from: contractOwnerAddress},
        );
        await accountsInstance.signup(
            fakeAdminRegionDid,
            { from: adminRegionAddress },
        );
    });

    // set region admin
    it('set region admin', async () => {
        await donationsInstance.setRegionAdmin(fakeRegionId, fakeAdminRegionDid, { from: contractOwnerAddress });
        const currentAdmin = await donationsInstance.getRegionAdmin(fakeRegionId);
        currentAdmin.should.be.equal(adminRegionAddress);
    });

    // send donation
    it('send donation', async () => {
        const previousBalance = await web3.eth.getBalance(userAddress);
        const tx = await donationsInstance.donate({
            value: web3.utils.toWei('1', 'ether'),
            from: userAddress,
        });
        const totalGas = tx.receipt.gasUsed * networkGasPrice;
        const contractBalance = await web3.eth.getBalance(donationsInstance.address);
        const currentBalance = await web3.eth.getBalance(userAddress);
        const difference = new BigNumber(previousBalance).minus(currentBalance).minus(totalGas).toNumber();
        difference.should.be.equal(parseInt(web3.utils.toWei('1', 'ether')));
        contractBalance.should.be.equal(web3.utils.toWei('1', 'ether'));
    });

    // send three donations
    it('send three donations', async () => {
        await donationsInstance.donate({
            value: web3.utils.toWei('1', 'ether'),
            from: userAddress,
        });
        await donationsInstance.donate({
            value: web3.utils.toWei('2', 'ether'),
            from: anotherUserAddress,
        });
        await donationsInstance.donate({
            value: web3.utils.toWei('3', 'ether'),
            from: someOtherUserAddress,
        });
        const contractBalance = await web3.eth.getBalance(donationsInstance.address);
        contractBalance.should.be.equal(web3.utils.toWei('6', 'ether'));
    });

    // admin region withdraws part of it
    it('admin region withdraws part of it', async () => {
        await donationsInstance.donate({
            value: web3.utils.toWei('1', 'ether'),
            from: userAddress,
        });
        await donationsInstance.donate({
            value: web3.utils.toWei('2', 'ether'),
            from: anotherUserAddress,
        });
        //
        const previousBalance = await web3.eth.getBalance(adminRegionAddress);
        const withdrawAmount = web3.utils.toWei('1.6', 'ether');
        const tx = await donationsInstance.requestWithdraw(withdrawAmount, { from: adminRegionAddress });
        const totalGas = tx.receipt.gasUsed * networkGasPrice;
        const currentBalance = await web3.eth.getBalance(adminRegionAddress);
        const contractBalance = await web3.eth.getBalance(donationsInstance.address);
        contractBalance.should.be.equal(web3.utils.toWei('1.4', 'ether'));
        const difference = new BigNumber(currentBalance).minus(previousBalance).plus(totalGas).toNumber();
        difference.should.be.equal(parseInt(withdrawAmount));
    });

    // fails to admin region withdraw more than allowed

    // fails to not admin region try to withdraw

    // failt to set admin user with not signed account

});
