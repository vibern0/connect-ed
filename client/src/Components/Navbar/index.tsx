import React, { Component } from 'react';
import { Modal, Button, Box, Card, Heading, Text, UPortButton } from 'rimble-ui';
import logo from '../../Assets/logo.webp';
import wifi from './wiki.png';
import './index.css';


interface INavbarState {
    toggleSignUpModal: boolean;
}
class Navbar extends Component<{}, INavbarState> {

    constructor(props: any) {
        super(props);
        this.state = {
            toggleSignUpModal: false,
        };
    }

    public toogleSignUpModal = (e: any) => {
        e.preventDefault();
        this.setState((state, props) => ({ toggleSignUpModal: !state.toggleSignUpModal }));
    }

    public render() {
        return (
            <>
                <nav className="navbar" role="navigation" aria-label="main navigation" style={{ height: '160px', padding: '30px 50px 0px 50px' }}>
                    <div className="navbar-brand">
                        <img src={logo} height="130px" width="130px" />

                        <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div id="navbarBasicExample" className="navbar-menu">
                        <div className="navbar-end">
                            <a className="navbar-item" style={{ fontVariantCaps: 'all-petite-caps', fontWeight: 600, fontSize: 'larger' }}>
                                <img src={wifi} style={{ height: '30px', padding: '0px 10px 0px 0px' }} />
                                Unicef Challenge
                            </a>
                            <div className="navbar-item">
                                <div className="buttons">
                                    <a className="button is-primary" onClick={this.toogleSignUpModal}>
                                        <strong>Sign up</strong>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav >
                {this.renderSignUpModal()}
            </>
        );
    }

    private renderSignUpModal = () => {
        return (
            <React.Fragment>
                <Modal isOpen={this.state.toggleSignUpModal}>
                    <Card width={"420px"} p={0}>
                        <Button.Text
                            icononly
                            icon={"Close"}
                            color={"moon-gray"}
                            position={"absolute"}
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
                            <UPortButton>Connect with uPort</UPortButton>
                        </Box>
                    </Card>
                </Modal>
            </React.Fragment>
        );
    }
}

export default Navbar;
