import BigNumber from 'bignumber.js';
import ipfsClient from 'ipfs-http-client';
import truffleContract from 'truffle-contract';
import Web3 from 'web3';

import getWeb3 from '../utils/getWeb3';

import AccountsContract from '../contracts/Accounts.json';



const networkID: string = process.env.REACT_APP_NETWORK_ID === undefined ? '3' : process.env.REACT_APP_NETWORK_ID;
const ipfs = ipfsClient({
    host: process.env.REACT_APP_IPFS_HOST,
    port: process.env.REACT_APP_IPFS_PORT,
    protocol: process.env.REACT_APP_IPFS_PROTOCOL,
});



/*
 * Blockchain state interface
 */
interface IBlockchainState {
    userAccount: string;
    web3: any;
}
/**
 * Blockchain generic is a class used to serve with some static methods
 * that does some generic call which are used often in different parts
 * of the application.
 */
class BlockchainGeneric {

    // tslint:disable-next-line member-ordering
    public static async onLoad(): Promise<IBlockchainState> {
        // load web3 and the usar accoun
        console.log("x1");
        const web3 = new Web3((window as any).ethereum);
        await (window as any).ethereum.enable();
        console.log("x1");
        const accounts = await (web3 as any).eth.getAccounts();
        console.log("x1");
        // update component state
        return ({
            userAccount: accounts[0],
            web3,
        });
    }

    public static async loadAccountsContract(web3: any): Promise<{ accountsContract: any }> {
        // Get the contract instance.
        const Contract = truffleContract(AccountsContract);
        Contract.setProvider(web3.currentProvider);
        const instance = await Contract.deployed();
        // return values
        return { accountsContract: instance };
    }
}

export default BlockchainGeneric;
