import React, { Component } from 'react';
import Cookies from 'universal-cookie';

import BlockchainGeneric, { IBasicComponentState } from '../../Common';
import getUport from '../../utils/getUport';

import Navbar from '../../Components/Navbar';


interface IAdminState extends IBasicComponentState {
    ispContract: any;
}
class Admin extends Component<{}, IAdminState> {

    constructor(props: any) {
        super(props);
        this.state = {
            accountsContract: undefined as any,
            cookies: new Cookies(),
            ispContract: undefined as any,
            uport: getUport(),
            userAccount: '',
            web3: undefined as any,
        };
    }

    public componentDidMount = async () => {
        const generic = await BlockchainGeneric.onLoad();
        const accountsContract = await BlockchainGeneric.loadAccountsContract(generic.web3);
        const ispContract = await BlockchainGeneric.loadISPContract(generic.web3);
        this.setState({
            accountsContract,
            ispContract,
            userAccount: generic.userAccount,
            web3: generic.web3,
        });
    }

    public apply = () => {
        //console.log(await ispContract.setRegionISP(1, 'did:ethr:0x7f43c88d43f77781d1217cd6c095829c0f2502df', { from: generic.userAccount }));
        //console.log(await ispContract.getRegionISP(1));
        //console.log(await ispContract.uploadDataFile('someHash', 'somemd5', 'did:ethr:0x7f43c88d43f77781d1217cd6c095829c0f2502df', 1, { from: generic.userAccount }));
        //console.log(await ispContract.getDataFiles());
    }

    public render() {
        const {
            cookies,
            userAccount,
            accountsContract,
            uport,
        } = this.state;
        return (
            <>
                <Navbar
                    userAccount={userAccount}
                    accountsContract={accountsContract}
                    cookies={cookies}
                    uport={uport}
                />
                <br />
                <br />
                <p>Hello Admin!</p>
            </>
        );
    }
}

export default Admin;
