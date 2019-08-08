import ipfsClient from 'ipfs-http-client';
import Web3 from 'web3';

import getUport from '../utils/getUport';

import AccountsContract from '../contracts/Accounts.json';
const uport = getUport();
const web3 = new Web3((window as any).ethereum);


const networkID: string = process.env.REACT_APP_NETWORK_ID === undefined ? '3' : process.env.REACT_APP_NETWORK_ID;
const ipfs = ipfsClient({
    host: process.env.REACT_APP_IPFS_HOST,
    port: process.env.REACT_APP_IPFS_PORT,
    protocol: process.env.REACT_APP_IPFS_PROTOCOL,
});

export { networkID, ipfs, AccountsContract, uport, web3 };
