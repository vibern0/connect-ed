import React, { Component } from 'react';
import { Heading } from 'rimble-ui';
import Cookies from 'universal-cookie';

import BlockchainGeneric from '../../Common';
import getUport from '../../utils/getUport';
import { Background, Content } from './styles';

import Navbar from '../../Components/Navbar';
import unicefLogo from './unicef-logo.png';


interface IMainState {
    web3: any;
    uport: any;
    userAccount: string;
    accountsContract: any;
    cookies: Cookies;
}
class Main extends Component<{}, IMainState> {

    constructor(props: any) {
        super(props);
        const cookies = new Cookies();
        this.state = {
            accountsContract: undefined as any,
            cookies,
            uport: getUport(),
            userAccount: '',
            web3: undefined as any,
        };
    }

    public componentDidMount = () => {
        const { cookies } = this.state;
        if (cookies.get('did') !== undefined) {
            BlockchainGeneric.onLoad().then((generic) => {
                BlockchainGeneric.loadAccountsContract(generic.web3).then((accountsContract: any) => {
                    this.setState({
                        accountsContract,
                        userAccount: generic.userAccount,
                        web3: generic.web3,
                    });
                });
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
