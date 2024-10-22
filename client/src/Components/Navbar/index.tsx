import React, { Component } from 'react';
import { Box, Button, Card, Heading, Modal, Text, UPortButton, Avatar, Flex } from 'rimble-ui';
import styled from 'styled-components';
import Cookies from 'universal-cookie';

import BlockchainGeneric from '../../Common';

import logo from '../../Assets/logo.webp';
import avatar from './avatar.webp';
import './index.css';
import wifi from './wiki.webp';


const NavbarItem = styled.div`
    margin: 0px 5px;
    cursor: pointer;
`;
/**
 * Navbar properties and states
 */
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
/**
 * Navbar component. Holds all the actions related to navbar.
 * LOgin, logout, listing account and menu.
 */
class Navbar extends Component<INavbarProps, INavbarState> {

    constructor(props: any) {
        super(props);
        // if the user is not logged in and accessing a private page
        // redirect to main page
        if (this.props.cookies.get('did') === undefined && window.location.pathname === '/historical') {
            window.location.href = '/';
            return;
        }
        this.state = {
            toggleSignUpModal: false,
            toogleLogoutModal: false,
        };
    }

    /**
     * open/close sigup modal
     */
    public toogleSignUpModal = (event: any) => {
        this.setState((state) => ({ toggleSignUpModal: !state.toggleSignUpModal }));
        event.preventDefault();
    }

    /**
     * open/close logout modal
     */
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

    public loginDemoISP = (event: any) => {
        const { cookies } = this.props;
        cookies.set('did', 'demo-isp', { path: '/' });
        window.location.reload();
    }

    public loginDemoRegionAdmin = (event: any) => {
        const { cookies } = this.props;
        cookies.set('did', 'demo-region-admin', { path: '/' });
        window.location.reload();
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
                        <img src={logo} alt="tree logo" height="130px" width="130px" onClick={this.goMainPage} />

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
                                <img
                                    src={wifi}
                                    alt="wifi icon"
                                    style={{ height: '30px', padding: '0px 10px 0px 0px' }}
                                />
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
        const username = uport.state.name;
        // if the user is logged, say hello!
        const commonNavbarItems = (
            <>
                <NavbarItem className="navbar-item"><a href="/donate">Donate</a></NavbarItem>
                <NavbarItem className="navbar-item"><a href="/connections">Connection</a></NavbarItem>
            </>
        );
        if (username !== undefined || cookies.get('did') !== undefined) {
            return (
                <Flex>
                    {commonNavbarItems}
                    <NavbarItem className="navbar-item"><a href="/historical">Historical</a></NavbarItem>
                    <NavbarItem className="navbar-item">Wecolme, {(username !== undefined) ? username : cookies.get('did')}</NavbarItem>
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
            <Flex>
                {commonNavbarItems}
                <a className="button is-primary" onClick={this.toogleSignUpModal}>
                    <strong>Sign up</strong>
                </a>
            </Flex>
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
                        <br />
                        <Text>Hello,</Text>
                        <Text>Welcome to Connect-Ed</Text>
                        <Text>In order to login you need uPort</Text>
                        <Text>Please, use the button below</Text>
                        <br />
                        <br />
                        <UPortButton onClick={this.loginWithUPort}>Connect with uPort</UPortButton>
                        <br />
                        <br />
                        <Text>You can use the demo ISP account to see how the system is within.</Text>
                        <br />
                        <a className="button is-primary" onClick={this.loginDemoISP}>
                            <strong>Demo ISP Account</strong>
                        </a>
                        <br />
                        <a className="button is-primary" onClick={this.loginDemoRegionAdmin}>
                            <strong>Demo Region Admin</strong>
                        </a>
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
