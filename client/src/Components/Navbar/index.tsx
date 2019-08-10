import React, { Component } from 'react';
import { Box, Button, Card, Heading, Modal, Text, UPortButton, Avatar, Flex } from 'rimble-ui';
import styled from 'styled-components';
import Cookies from 'universal-cookie';

import BlockchainGeneric from '../../Common';

import logo from '../../Assets/logo.webp';
import avatar from './avatar.png';
import './index.css';
import wifi from './wiki.png';


const NavbarItem = styled.div`
    margin: 0px 15px;
    cursor: pointer;
`;
interface INavbarProps {
    uport: any;
    cookies: Cookies;
    userAccount: string;
    accountsContract: any;
}
interface INavbarState {
    toogleLogoutModal: boolean;
    toggleSignUpModal: boolean;
}
class Navbar extends Component<INavbarProps, INavbarState> {

    constructor(props: any) {
        super(props);
        // if the user is not in the root page or donate page
        // redirect to main page
        if (window.location.pathname !== '/' && window.location.pathname !== '/donate') {
            window.location.href = '/';
            return;
        }
        this.state = {
            toggleSignUpModal: false,
            toogleLogoutModal: false,
        };
    }

    public toogleSignUpModal = (event: any) => {
        this.setState((state) => ({ toggleSignUpModal: !state.toggleSignUpModal }));
        event.preventDefault();
    }

    public toogleLogoutModal = (event: any) => {
        this.setState((state) => ({ toogleLogoutModal: !state.toogleLogoutModal }));
        event.preventDefault();
    }

    public loginWithUPort = async (event: any) => {
        const { uport, accountsContract, userAccount, cookies } = this.props;
        //
        let currentAccountsContract = accountsContract;
        let currentUserAccount = userAccount;
        if (accountsContract === undefined || userAccount === undefined) {
            // load it!
            const generic = await BlockchainGeneric.onLoad();
            const newAccountsContract = await BlockchainGeneric.loadAccountsContract(generic.web3);
            currentUserAccount = generic.userAccount;
            currentAccountsContract = newAccountsContract;
        }
        //
        const req = {
            notifications: true,
            requested: ['name', 'country'],
        };
        uport.requestDisclosure(req);
        uport.onResponse('disclosureReq').then(async (disclosureReq: any) => {
            //
            uport.sendVerification({
                claim: { User: { Signed: new Date() } },
            });
            //
            await currentAccountsContract.signup(disclosureReq.payload.did, { from: currentUserAccount });
            cookies.set('did', disclosureReq.payload.did, { path: '/' });
            window.location.reload();
        });
    }

    public handleLogout = (event: any) => {
        const { uport, cookies } = this.props;
        uport.logout();
        window.location.reload();
        cookies.remove('did');
        event.preventDefault();
    }

    public goMainPage = (event: any) => {
        (window as any).location.href = '/';
        event.preventDefault();
    }

    public render() {
        return (
            <>
                <nav
                    className="navbar"
                    role="navigation"
                    aria-label="main navigation"
                    style={{ height: '160px', padding: '30px 50px 0px 50px' }}
                >
                    <div className="navbar-brand">
                        <img src={logo} height="130px" width="130px" onClick={this.goMainPage} />

                        <a
                            role="button"
                            className="navbar-burger burger"
                            aria-label="menu"
                            aria-expanded="false"
                            data-target="navbarBasicExample"
                        >
                            <span aria-hidden="true" />
                            <span aria-hidden="true" />
                            <span aria-hidden="true" />
                        </a>
                    </div>

                    <div id="navbarBasicExample" className="navbar-menu">
                        <div className="navbar-end">
                            <span
                                className="navbar-item"
                                style={{ fontVariantCaps: 'all-petite-caps', fontWeight: 600, fontSize: 'larger' }}
                            >
                                <img src={wifi} style={{ height: '30px', padding: '0px 10px 0px 0px' }} />
                                Unicef Challenge
                            </span>
                            <div className="navbar-item">
                                {this.loadCurrentAccount()}
                            </div>
                        </div>
                    </div>
                </nav >
                {this.renderSignUpModal()}
                {this.renderLogoutModal()}
            </>
        );
    }

    private loadCurrentAccount = () => {
        const { uport, cookies } = this.props;
        // load uport status from browser
        uport.loadState();
        const role = 2;
        const username = uport.state.name;
        // if the user is logged, say hello!
        if (username !== undefined) {
            return (
                <Flex>
                    {role === 2 && <NavbarItem className="navbar-item">ISP</NavbarItem>}
                    <NavbarItem className="navbar-item">Wecolme, {username}</NavbarItem>
                    <NavbarItem className="navbar-item">
                        <Avatar
                            size="medium"
                            src={avatar}
                            onClick={this.toogleLogoutModal}
                        />
                    </NavbarItem>
                </Flex>
            );
        }
        return (
            <div className="buttons">
                <a className="button is-primary" onClick={this.toogleSignUpModal}>
                    <strong>Sign up</strong>
                </a>
            </div>
        );
    }

    private renderSignUpModal = () => {
        return (
            <Modal isOpen={this.state.toggleSignUpModal}>
                <Card width={'420px'} p={0}>
                    <Button.Text
                        icononly={true}
                        icon={'Close'}
                        color={'moon-gray'}
                        position={'absolute'}
                        top={0}
                        right={0}
                        mt={3}
                        mr={3}
                        onClick={this.toogleSignUpModal}
                    />

                    <Box p={4} mb={3}>
                        <Heading.h3>Sign Up</Heading.h3>
                        <Text>Hello,</Text>
                        <Text>Welcome to Connect-Ed</Text>
                        <Text>In order to login you need uPort</Text>
                        <Text>Please, use the button below</Text>
                        <UPortButton onClick={this.loginWithUPort}>Connect with uPort</UPortButton>
                    </Box>
                </Card>
            </Modal>
        );
    }

    private renderLogoutModal = () => {
        return (
            <Modal isOpen={this.state.toogleLogoutModal}>
                <Card width={'420px'} p={0}>
                    <Button.Text
                        icononly={true}
                        icon={'Close'}
                        color={'moon-gray'}
                        position={'absolute'}
                        top={0}
                        right={0}
                        mt={3}
                        mr={3}
                        onClick={this.toogleLogoutModal}
                    />

                    <Box p={4} mb={3}>
                        <Heading.h3>Logout</Heading.h3>
                        <Button onClick={this.handleLogout}>Logout</Button>
                    </Box>
                </Card>
            </Modal>
        );
    }
}

export default Navbar;
