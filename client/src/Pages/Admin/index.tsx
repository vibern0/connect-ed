import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { Button, Form, Heading, Box } from 'rimble-ui';
import Cookies from 'universal-cookie';

import BlockchainGeneric, { IBasicComponentState } from '../../Common';
import getUport from '../../utils/getUport';

import Navbar from '../../Components/Navbar';


interface IAdminState extends IBasicComponentState {
    ispContract: any;
    donationsContract: any;
    isCurrentUserOwner: boolean;
    newIspDid: string;
    newIspRegion: string;
    newRegionAdminDid: string;
    newRegionAdminRegion: string;
}
class Admin extends Component<{}, IAdminState> {

    constructor(props: any) {
        super(props);
        this.state = {
            accountsContract: undefined as any,
            cookies: new Cookies(),
            donationsContract: undefined as any,
            isCurrentUserOwner: false,
            ispContract: undefined as any,
            newIspDid: '',
            newIspRegion: '',
            newRegionAdminDid: '',
            newRegionAdminRegion: '',
            uport: getUport(),
            userAccount: '',
            web3: undefined as any,
        };
    }

    public componentDidMount = async () => {
        const generic = await BlockchainGeneric.onLoad();
        const accountsContract = await BlockchainGeneric.loadAccountsContract(generic.web3);
        const donationsContract = await BlockchainGeneric.loadDonationsContract(generic.web3);
        const ispContract = await BlockchainGeneric.loadISPContract(generic.web3);
        const isCurrentUserOwner = await ispContract.owner() === generic.userAccount;
        this.setState({
            accountsContract,
            donationsContract,
            isCurrentUserOwner,
            ispContract,
            userAccount: generic.userAccount,
            web3: generic.web3,
        });
    }

    public render() {
        const {
            cookies,
            userAccount,
            accountsContract,
            uport,
            isCurrentUserOwner,
        } = this.state;
        console.log(cookies.get('did'));
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
                {isCurrentUserOwner && this.renderAdminAction()}
            </>
        );
    }

    private renderAdminAction = () => {
        const { newIspDid, newIspRegion, newRegionAdminDid, newRegionAdminRegion } = this.state;
        return (
            <div style={{ margin: '0px 20%' }}>
                <Heading.h2>Set account as ISP</Heading.h2>
                <Form onSubmit={this.handleSubmitNewIsp}>
                    <Form.Field label="DID of the new ISP" width={1}>
                        <Form.Input
                            type="string"
                            name="newIspDid"
                            value={newIspDid}
                            required={true}
                            width={1}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field label="ISP of Readion (id)" width={1}>
                        <Form.Input
                            type="string"
                            name="newIspRegion"
                            value={newIspRegion}
                            required={true}
                            width={1}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Button type="submit" width={1}>
                        Register ISP
                    </Button>
                </Form>
                <br />
                <br />
                <br />
                <br />
                <Heading.h2>Set account as Region Admin</Heading.h2>
                <Form onSubmit={this.handleSubmitNewRegionAdmin}>
                    <Form.Field label="DID of the new Region Admin" width={1}>
                        <Form.Input
                            type="string"
                            name="newRegionAdminDid"
                            value={newRegionAdminDid}
                            required={true}
                            width={1}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field label="Admin of Region (id)" width={1}>
                        <Form.Input
                            type="string"
                            name="newRegionAdminRegion"
                            value={newRegionAdminRegion}
                            required={true}
                            width={1}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Button type="submit" width={1}>
                        Register Admin Region
                    </Button>
                </Form>
            </div>
        );
    }

    private handleSubmitNewIsp = (event: any) => {
        const { ispContract, userAccount, newIspRegion, newIspDid } = this.state;
        ispContract.setRegionISP(new BigNumber(newIspRegion), newIspDid, { from: userAccount })
            .then(() => {
                alert('Transaction sent!');
            });
        event.preventDefault();
    }

    private handleSubmitNewRegionAdmin = (event: any) => {
        const { donationsContract, userAccount, newRegionAdminDid, newRegionAdminRegion } = this.state;
        donationsContract.setRegionAdmin(new BigNumber(newRegionAdminRegion), newRegionAdminDid, { from: userAccount })
            .then(() => {
                alert('Transaction sent!');
            });
        event.preventDefault();
    }

    private handleChange = (event: any) => {
        if (event.target.name === 'newIspDid') {
            this.setState({ newIspDid: event.target.value });
        } else if (event.target.name === 'newIspRegion') {
            this.setState({ newIspRegion: event.target.value });
        } else if (event.target.name === 'newRegionAdminDid') {
            this.setState({ newRegionAdminDid: event.target.value });
        } else if (event.target.name === 'newRegionAdminRegion') {
            this.setState({ newRegionAdminRegion: event.target.value });
        }
    }
}

export default Admin;
