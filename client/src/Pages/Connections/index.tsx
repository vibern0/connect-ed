import React, { Component } from 'react';
import Cookies from 'universal-cookie';

import BlockchainGeneric, { IBasicComponentState } from '../../Common';
import getUport from '../../utils/getUport';

import Navbar from '../../Components/Navbar';
import AmazonasMap from './AmazonasMap';


class Connections extends Component<{}, IBasicComponentState> {

    constructor(props: any) {
        super(props);
        this.state = {
            accountsContract: undefined as any,
            cookies: new Cookies(),
            uport: getUport(),
            userAccount: '',
            web3: undefined as any,
        };
    }

    public componentDidMount = async () => {
        const { cookies } = this.state;
        const generic = await BlockchainGeneric.onLoad();
        const accountsContract = await BlockchainGeneric.loadAccountsContract(generic.web3);
        this.setState({
            accountsContract,
            userAccount: generic.userAccount,
            web3: generic.web3,
        });
    }

    public render() {
        const { cookies, userAccount, accountsContract, uport } = this.state;
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
                <AmazonasMap />
            </>
        );
    }
}

export default Connections;
