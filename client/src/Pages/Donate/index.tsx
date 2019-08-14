import awaitTransactionMined from 'await-transaction-mined';
import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { Button, Form, Heading, Text, Table } from 'rimble-ui';
import styled from 'styled-components';
import Cookies from 'universal-cookie';


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
    isCurrentUserReginAdmin: boolean;
    donationWithdrawAmount: string;
}
/**
 * Donate component for /donate route.
 * It allows any user, no necessarly registered, to do some donation.
 * Donations are intended to be listed, but the current list is just an example.
 * As a region admin, the page is a bit different and it has the possbility to request a withdraw.
 */
class Donate extends Component<{}, IDonateState> {

    constructor(props: any) {
        super(props);
        this.state = {
            accountsContract: undefined as any,
            cookies: new Cookies(),
            donationAmount: '',
            donationWithdrawAmount: '',
            donationsContract: undefined as any,
            isCurrentUserReginAdmin: undefined as any,
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
            const userProfile = await accountsContract.getUser(cookies.get('did'));
            this.setState({
                accountsContract,
                donationsContract,
                isCurrentUserReginAdmin: userProfile[1].toNumber() === 3,
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

    public handleSubmitRequestWithdraw = (event: any) => {
        new Promise(async (resolve: any, reject: any) => {
            const { donationsContract, userAccount, donationWithdrawAmount, web3 } = this.state;
            const receipt = await donationsContract.requestWithdraw(web3.utils.toWei(donationWithdrawAmount, 'ether'), {
                from: userAccount,
            });
            resolve(receipt);
        }).then(async (receipt: any) => {
            const { web3, donationsContract } = this.state;
            alert('Thank you for your request.\nBalance will be updated after transaction is mined!');
            await awaitTransactionMined.awaitTx(web3, receipt.tx, {interval: 1000});
            // update balance
            const balanceDonationsContract = await web3.eth.getBalance(donationsContract.address);
            this.setState({ totalDonations: web3.utils.fromWei(balanceDonationsContract.toString()) });
        });
        event.preventDefault();
    }

    /**
     * Handle input change
     */
    public handleDonationAmountChange = (event: any) => {
        this.setState({ donationAmount: event.target.value });
    }

    /**
     * Handle input change
     */
    public handleDonationWithdrawAmountChange = (event: any) => {
        this.setState({ donationWithdrawAmount: event.target.value });
    }

    public render() {
        const {
            cookies,
            userAccount,
            accountsContract,
            uport,
            isCurrentUserReginAdmin,
        } = this.state;
        let contentPage;
        if (isCurrentUserReginAdmin !== undefined || cookies.get('did') === 'demo-region-admin') {
            contentPage = (isCurrentUserReginAdmin || cookies.get('did') === 'demo-region-admin')
                ? this.renderRegionAdminPage() : this.renderPublicPage();
        }
        return (
            <>
                <Navbar
                    userAccount={userAccount}
                    accountsContract={accountsContract}
                    cookies={cookies}
                    uport={uport}
                />
                <Content>
                    {contentPage}
                </Content>
            </>
        );
    }

    private renderRegionAdminPage = () => {
        const { donationWithdrawAmount, totalDonations, cookies } = this.state;
        return (
            <>
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
                <br />
                <br />
                <Heading.h2 textAlign="center">Total Donated</Heading.h2>
                <Heading.h4 textAlign="center">{totalDonations} ETH</Heading.h4>
                <br />
                <br />
                <Text textAlign="center">You, as a region admin can request to withdraw a art of the donations.</Text>
                <br />
                <Form onSubmit={this.handleSubmitRequestWithdraw} style={{ padding: '0px 30%' }}>
                    <Form.Field label="Amount Requesting to Winthdraw in ETH" width={1}>
                        <Form.Input
                            type="text"
                            name="donationWithdrawAmount"
                            required={true}
                            value={donationWithdrawAmount}
                            onChange={this.handleDonationWithdrawAmountChange}
                            style={{ width: '100%' }}
                        />
                    </Form.Field>
                    <br />
                    <Button disabled={cookies.get('did') === 'demo-region-admin'} type="submit" width={1}>
                        Request Withdraw
                    </Button>
                </Form>
            </>
        );
    }

    private renderPublicPage = () => {
        const { donationAmount, totalDonations } = this.state;
        return (
            <>
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
            </>
        );
    }

    private listDonators = () => {
        return (
            <>
                <Heading.h2 textAlign="center">Top 3 donators</Heading.h2>
                <br />
                <Table style={{ width: '50%', margin: '0px 25%' }}>
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
