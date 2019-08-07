import React, { Component } from 'react';
import styled from 'styled-components'
import { Heading } from 'rimble-ui';
import Navbar from '../../Components/Navbar';
import amazonas from './amazonas.webp';
import unicefLogo from './unicef-logo.png';


const Background = styled.div`
    /* The image used */
    background-image: url(${amazonas});

    /* Full height */
    height: 100%;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    width: 100%;
    height: 880px;

    /* put it in the backgtround */
    position: absolute;
    z-index: -1;
    opacity: 0.5;
`;
const Content = styled.div`
    text-align: center;
`;

interface IMainState {
    //
}
class Main extends Component<{}, IMainState> {

    public render() {
        return (
            <>
                <Background />
                <Navbar />
                <Content>
                    <img src={unicefLogo} style={{height: '300px'}} />
                    <Heading.h1>Connect-Ed</Heading.h1>
                    <Heading.h3 theme={{colors: { grey: '#696969' }}} color='grey'>REDUCING THE DIGITAL DEVIDE</Heading.h3>
                </Content>
            </>
        );
    }
}

export default Main;
