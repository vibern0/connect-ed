import React, { Component } from 'react';
import Navbar from '../../Components/Navbar';
import AmazonasMap from './AmazonasMap';

interface IConnectionsState {
    //
}
class Connections extends Component<{}, IConnectionsState> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <>
                <br />
                <br />
                <AmazonasMap />
            </>
        );
    }
}

export default Connections;
