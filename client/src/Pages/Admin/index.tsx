import React, { Component } from 'react';
import { Button, Form, Heading, Box } from 'rimble-ui';
import Cookies from 'universal-cookie';

import BlockchainGeneric, { IBasicComponentState } from '../../Common';
import getUport from '../../utils/getUport';

import Navbar from '../../Components/Navbar';


interface IAdminState extends IBasicComponentState {
    ispContract: any;
    isCurrentUserOwner: boolean;
    newIspDid: string;
    newIspRegion: string;
}
class Admin extends Component<{}, IAdminState> {

    constructor(props: any) {
        super(props);
        this.state = {
            accountsContract: undefined as any,
            cookies: new Cookies(),
            isCurrentUserOwner: false,
            ispContract: undefined as any,
            newIspDid: '',
            newIspRegion: '',
            uport: getUport(),
            userAccount: '',
            web3: undefined as any,
        };
    }

    public componentDidMount = async () => {
        const generic = await BlockchainGeneric.onLoad();
        const accountsContract = await BlockchainGeneric.loadAccountsContract(generic.web3);
        const ispContract = await BlockchainGeneric.loadISPContract(generic.web3);
        const isCurrentUserOwner = await ispContract.owner() === generic.userAccount;
        this.setState({
            accountsContract,
            isCurrentUserOwner,
            ispContract,
            userAccount: generic.userAccount,
            web3: generic.web3,
        });
    }

    public apply = () => {
        //console.log(await ispContract.setRegionISP(1, 'did:ethr:0x7f43c88d43f77781d1217cd6c095829c0f2502df', { from: generic.userAccount }));
        //console.log(await ispContract.getRegionISP(1));
        //console.log(await ispContract.uploadDataFile('someHash', 'somemd5', 'did:ethr:0x7f43c88d43f77781d1217cd6c095829c0f2502df', 1, { from: generic.userAccount }));
        //console.log(await ispContract.getDataFiles());
    }

    public render() {
        const {
            cookies,
            userAccount,
            accountsContract,
            uport,
            isCurrentUserOwner,
        } = this.state;
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
        const { newIspDid, newIspRegion } = this.state;
        return (
            <>
                <Heading.h2>Set account as ISP</Heading.h2>
                <Form onSubmit={this.handleSubmitNewIsp}>
                    <Form.Field label="DID of the new ISP" width={1}>
                        <Form.Input
                            type="string"
                            value={newIspDid}
                            required={true}
                            width={1}
                        />
                    </Form.Field>
                    <Form.Field label="ISP of Readion (id)" width={1}>
                        <Form.Input
                            type="string"
                            value={newIspRegion}
                            required={true}
                            width={1}
                        />
                    </Form.Field>
                    <Button type="submit" width={1}>
                        Register ISP
                    </Button>
                </Form>
            </>
        );
    }

    private handleSubmitNewIsp = (event: any) => {
        event.preventDefault();
    }
}

export default Admin;
