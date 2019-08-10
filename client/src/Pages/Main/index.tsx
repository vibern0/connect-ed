import React, { Component } from 'react';
import { Heading } from 'rimble-ui';
import Cookies from 'universal-cookie';

import BlockchainGeneric, { IBasicComponentState } from '../../Common';
import getUport from '../../utils/getUport';
import { Background, Content } from './styles';

import Navbar from '../../Components/Navbar';
import unicefLogo from './unicef-logo.png';


class Main extends Component<{}, IBasicComponentState> {

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
        if (cookies.get('did') !== undefined) {
            const generic = await BlockchainGeneric.onLoad();
            const accountsContract = await BlockchainGeneric.loadAccountsContract(generic.web3);
            this.setState({
                accountsContract,
                userAccount: generic.userAccount,
                web3: generic.web3,
            });
        }
    }

    public render() {
        const { cookies, userAccount, accountsContract, uport } = this.state;
        return (
            <>
                <Background />
                <Navbar
                    userAccount={userAccount}
                    accountsContract={accountsContract}
                    cookies={cookies}
                    uport={uport}
                />
                <Content>
                    <img src={unicefLogo} style={{ height: '300px' }} />
                    <Heading.h1>Connect-Ed</Heading.h1>
                    <Heading.h3 theme={{ colors: { grey: '#696969' } }} color="grey">
                        REDUCING THE DIGITAL DEVIDE
                    </Heading.h3>
                </Content>
            </>
        );
    }
}

export default Main;
