import React, { Component } from 'react';
import styled from 'styled-components'
import Navbar from '../../Components/Navbar';
import amazonas from './amazonas.jpg';


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
    object-fit: cover;
`;

interface IMainState {
    //
}
class Main extends Component<{}, IMainState> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <Background>
                <Navbar />
            </Background>
        );
    }
}

export default Main;
