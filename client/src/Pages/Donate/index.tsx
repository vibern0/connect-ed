import React, { Component } from 'react';
import { Button, Form, Heading, Text, Table } from 'rimble-ui';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import awaitTransactionMined from 'await-transaction-mined';


import BlockchainGeneric, { IBasicComponentState } from '../../Common';
import getUport from '../../utils/getUport';

import Navbar from '../../Components/Navbar';
import getWeb3 from '../../utils/getWeb3';


const Content = styled.div`
    margin: 0px 20%;
`;
interface IDonateState extends IBasicComponentState {
    donationAmount: string;
    donationsContract: any;
    totalDonations: string;
}
class Donate extends Component<{}, IDonateState> {

    constructor(props: any) {
        super(props);
        this.state = {
            accountsContract: undefined as any,
            cookies: new Cookies(),
            donationAmount: '',
            donationsContract: undefined as any,
            totalDonations: '0',
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
            const donationsContract = await BlockchainGeneric.loadDonationsContract(generic.web3);
            const balanceDonationsContract = await generic.web3.eth.getBalance(donationsContract.address);
            this.setState({
                accountsContract,
                donationsContract,
                totalDonations: generic.web3.utils.fromWei(balanceDonationsContract.toString()),
                userAccount: generic.userAccount,
                web3: generic.web3,
            });
        } else {
            const web3 = await getWeb3() as any;
            const accountsContract = await BlockchainGeneric.loadAccountsContract(web3);
            const donationsContract = await BlockchainGeneric.loadDonationsContract(web3);
            const balanceDonationsContract = await web3.eth.getBalance(donationsContract.address);
            this.setState({
                accountsContract,
                donationsContract,
                totalDonations: web3.utils.fromWei(balanceDonationsContract.toString()),
                web3,
            });
        }
    }

    public handleSubmitDonate = (event: any) => {
        new Promise(async (resolve: any, reject: any) => {
            const { donationsContract, web3, userAccount, donationAmount } = this.state;
            let currentDonationsContract = donationsContract;
            let currentWeb3 = web3;
            let currentUserAccount = userAccount;
            if (donationsContract === undefined) {
                const generic = await BlockchainGeneric.onLoad();
                const accountsContract = await BlockchainGeneric.loadAccountsContract(generic.web3);
                const newDonationsContract = await BlockchainGeneric.loadDonationsContract(generic.web3);
                this.setState({
                    accountsContract,
                    donationsContract,
                    userAccount: generic.userAccount,
                    web3: generic.web3,
                });
                currentDonationsContract = newDonationsContract;
                currentWeb3 = generic.web3;
                currentUserAccount = generic.userAccount;
            }
            const receipt = await currentDonationsContract.donate({
                from: currentUserAccount,
                value: currentWeb3.utils.toWei(donationAmount, 'ether'),
            });
            resolve(receipt);
        }).then(async (receipt: any) => {
            const { web3, donationsContract } = this.state;
            alert('Thank you for you donation.\nBalance will be updated after transaction is mined!');
            await awaitTransactionMined.awaitTx(web3, receipt.tx, {interval: 1000});
            // update balance
            const balanceDonationsContract = await web3.eth.getBalance(donationsContract.address);
            this.setState({ totalDonations: web3.utils.fromWei(balanceDonationsContract.toString()) });
        });
        event.preventDefault();
    }

    public handleDonationAmountChange = (event: any) => {
        this.setState({ donationAmount: event.target.value });
    }

    public render() {
        const {
            donationAmount,
            cookies,
            userAccount,
            accountsContract,
            uport,
            totalDonations,
        } = this.state;
        return (
            <>
                <Navbar
                    userAccount={userAccount}
                    accountsContract={accountsContract}
                    cookies={cookies}
                    uport={uport}
                />
                <Content>
                    <br />
                    <br />
                    <br />
                    <div style={{ textAlign: 'center' }}>
                        <Heading.h2>Thank you</Heading.h2>
                        <br />
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum dapibus convallis.
                            Nulla vel laoreet augue. In tincidunt felis sapien, vel molestie felis fringilla nec. Sed
                            ac malesuada tortor. Etiam tincidunt in arcu eget sollicitudin. Vestibulum tempus blandit
                            dui, pulvinar facilisis metus pharetra nec. Vivamus sed posuere massa. Aliquam accumsan ex
                    sit amet ullamcorper ultricies. Nullam ac felis nisl. In id dictum felis.</p>
                        <br /><br />
                    </div>
                    <Form onSubmit={this.handleSubmitDonate} style={{ padding: '0px 30%' }}>
                        <Form.Field label="Amount to Donate in ETH" width={1}>
                            <Form.Input
                                type="text"
                                name="donationAmount"
                                required={true}
                                value={donationAmount}
                                onChange={this.handleDonationAmountChange}
                                style={{ width: '100%' }}
                            />
                        </Form.Field>
                        <br />
                        <Button type="submit" width={1}>Donate</Button>
                    </Form>
                    <br />
                    <br />
                    <Heading.h2 textAlign="center">Total Donated</Heading.h2>
                    <Heading.h4 textAlign="center">{totalDonations} ETH</Heading.h4>
                    <br />
                    <br />
                    {this.listDonators()}
                </Content>
            </>
        );
    }

    private listDonators = () => {
        return (
            <>
                <Heading.h2 textAlign="center">Top 3 donators</Heading.h2>
                <br />
                <Table style={{width: '50%', margin: '0px 25%'}}>
                    <thead>
                        <tr>
                            <th>From</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>0xeb...cc0</td>
                            <td>0.12 ETH</td>
                        </tr>
                        <tr>
                            <td>0xsb...230</td>
                            <td>0.11 ETH</td>
                        </tr>
                        <tr>
                            <td>0xed...c40</td>
                            <td>0.10 ETH</td>
                        </tr>
                    </tbody>
                </Table>
                <br />
                <br />
                <Text textAlign="center">Click <a>here</a> to expand full list of donators!</Text>
            </>
        );
    }
}

export default Donate;
