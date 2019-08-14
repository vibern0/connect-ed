import truffleContract from 'truffle-contract';
import Cookies from 'universal-cookie';
import Web3 from 'web3';

import AccountsContract from '../contracts/Accounts.json';
import DonationsContract from '../contracts/Donations.json';
import ISPContract from '../contracts/ISP.json';

/**
 * Common state variables used accross all components
 */
export interface IBasicComponentState {
    web3: any;
    uport: any;
    userAccount: string;
    accountsContract: any;
    cookies: Cookies;
}
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

    /**
     * Initial basic loading to connect to web3 world!
     */
    // tslint:disable-next-line member-ordering
    public static async onLoad(): Promise<IBlockchainState> {
        // load web3 and the usar accoun
        const web3 = new Web3((window as any).ethereum);
        await (window as any).ethereum.enable();
        const accounts = await (web3 as any).eth.getAccounts();
        // update component state
        return ({
            userAccount: accounts[0],
            web3,
        });
    }

    /**
     * Create an instance of accounts contract
     * @param web3 web instance
     */
    public static async loadAccountsContract(web3: any): Promise<any> {
        // Get the contract instance.
        const Contract = truffleContract(AccountsContract);
        Contract.setProvider(web3.currentProvider);
        const instance = await Contract.deployed();
        // return values
        return instance;
    }

    /**
     * Create an instance of donations contract
     * @param web3 web instance
     */
    public static async loadDonationsContract(web3: any): Promise<any> {
        // Get the contract instance.
        const Contract = truffleContract(DonationsContract);
        Contract.setProvider(web3.currentProvider);
        const instance = await Contract.deployed();
        // return values
        return instance;
    }

    /**
     * Create an instance of isp contract
     * @param web3 web instance
     */
    public static async loadISPContract(web3: any): Promise<any> {
        // Get the contract instance.
        const Contract = truffleContract(ISPContract);
        Contract.setProvider(web3.currentProvider);
        const instance = await Contract.deployed();
        // return values
        return instance;
    }
}

export default BlockchainGeneric;
