import crypto from 'crypto';
import ipfsClient from 'ipfs-http-client';
import React, { Component } from 'react';
import { Button, Checkbox, Form, Heading, Text, Field, Input } from 'rimble-ui';
import styled from 'styled-components';
import Cookies from 'universal-cookie';

import BlockchainGeneric, { IBasicComponentState } from '../../Common';
import Navbar from '../../Components/Navbar';
import getUport from '../../utils/getUport';
import BigNumber from 'bignumber.js';


const Content = styled.div`
    margin: 0px 20%;
`;
interface IHistoricalState extends IBasicComponentState {
    invalidStartDate: boolean;
    invalidEndDate: boolean;
    startDate: string;
    endDate: string;
    region: string;
    ispContract: any;
}
class Historical extends Component<{}, IHistoricalState> {
    private uploadingFileBuffer: Buffer = undefined as any;

    constructor(props: any) {
        super(props);
        this.state = {
            accountsContract: undefined as any,
            cookies: new Cookies(),
            endDate: '',
            invalidEndDate: false,
            invalidStartDate: false,
            ispContract: undefined as any,
            region: '',
            startDate: '',
            uport: getUport(),
            userAccount: '',
            web3: undefined as any,
        };
    }

    public componentDidMount = async () => {
        const generic = await BlockchainGeneric.onLoad();
        const accountsContract = await BlockchainGeneric.loadAccountsContract(generic.web3);
        const ispContract = await BlockchainGeneric.loadISPContract(generic.web3);
        this.setState({
            accountsContract,
            ispContract,
            userAccount: generic.userAccount,
            web3: generic.web3,
        });
    }

    public handleSubmit = (event: any) => {
        const { ispContract, cookies, region, startDate, endDate, userAccount } = this.state;
        const ipfs = ipfsClient({
            host: process.env.REACT_APP_IPFS_HOST,
            port: process.env.REACT_APP_IPFS_PORT,
            protocol: process.env.REACT_APP_IPFS_PROTOCOL,
        });
        const md5Result = crypto.createHash('md5').update(this.uploadingFileBuffer).digest('hex');
        ipfs.add(this.uploadingFileBuffer).then((results: [{ path: string }]) => {
            ispContract.uploadDataFile(
                results[0].path,
                md5Result,
                cookies.get('did'),
                new BigNumber(region),
                new BigNumber(startDate),
                new BigNumber(endDate),
                { from: userAccount },
            );
        });
        event.preventDefault();
    }

    public captureFile = (event: any) => {
        const file = event.target.files[0];
        const reader = new (window as any).FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.uploadingFileBuffer = new Buffer(reader.result);
        };
        event.preventDefault();
    }

    public render() {
        return (
            <>
                {this.renderUploadOption()}
            </>
        );
    }

    private renderUploadOption = () => {
        const {
            cookies, userAccount, accountsContract, uport, invalidStartDate, invalidEndDate, startDate, endDate, region,
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
                    <Heading.h2 textAlign="center">Terms and Conditions</Heading.h2>
                    <br />
                    <Text textAlign="center">Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit. Sed fermentum dapibus convallis.
                        Nulla vel laoreet augue. In tincidunt felis sapien, vel molestie felis fringilla nec. Sed
                        ac malesuada tortor. Etiam tincidunt in arcu eget sollicitudin. Vestibulum tempus blandit
                        dui, pulvinar facilisis metus pharetra nec. Vivamus sed posuere massa. Aliquam accumsan ex
                    sit amet ullamcorper ultricies. Nullam ac felis nisl. In id dictum felis.</Text>
                    <br /><br />
                    <Text textAlign="center">Nunc eget sem vel dui ultricies scelerisque.
                        Vestibulum nec luctus tortor. Praesent
                        pretium nisl nisl, a lacinia felis varius ac. Cras mattis dui eu sodales finibus. Cras
                        finibus placerat euismod. Fusce vestibulum quam id quam volutpat blandit. Ut vulputate
                        consequat nulla, quis posuere lectus finibus eu. Morbi dignissim at purus sit amet
                        vulputate. Cras nec vehicula leo. Suspendisse commodo lectus augue, at lobortis ligula
                        pellentesque in. Suspendisse mauris risus, consectetur ornare pulvinar eget, eleifend
                        ut elit. Praesent pretium quam eu felis luctus, eu interdum nisl consequat. Etiam
                        consectetur velit sed bibendum gravida. Vestibulum ultrices odio vel consequat facilisis.
                        Maecenas lobortis vehicula ullamcorper.</Text>
                    <br /><br /><br />
                    <Form onSubmit={this.handleSubmit} style={{ padding: '0px 25%' }} encType="multipart/form-data">
                        <Field label="Data File to Upload" width={1}>
                            <Form.Input
                                width="100%"
                                id="my_file_upload"
                                required={true}
                                type="file"
                                onChange={this.captureFile}
                            />
                        </Field>
                        <Field label="Region (id)">
                            <Input
                                value={region}
                                required={true}
                                type="text"
                                onChange={this.handleChangeRegion}
                            />
                        </Field>
                        <br />
                        <Field label="Start Date">
                            <Input
                                borderColor={invalidStartDate ? 'red' : 'grey'}
                                value={this.formatDate(startDate)}
                                required={true}
                                type="date"
                                onChange={this.handleChangeIntervalStartDate}
                            />
                        </Field>
                        <Field style={{ float: 'right' as 'right' }} label="End Date">
                            <Input
                                borderColor={invalidEndDate ? 'red' : 'grey'}
                                value={this.formatDate(endDate)}
                                required={true}
                                type="date"
                                onChange={this.handleChangeIntervalEndDate}
                            />
                        </Field>
                        <Checkbox label="Your agree with the terms and conditions" required={true} />
                        <br /><br />
                        <Button type="submit" disabled={cookies.get('did') === 'demo-isp'} width={1}>Upload</Button>
                    </Form>
                </Content>
                <br />
                <br />
                <br />
            </>
        );
    }

    private formatDate = (timestamp: string) => {
        if (timestamp === '') {
            return '';
        }
        const date = new Date(parseInt(timestamp, 10));
        const output = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
            + ('0' + date.getDate()).slice(-2);
        return output;
    }

    private handleChangeIntervalStartDate = (event: any) => {
        const inputDateFromUser = new Date();
        inputDateFromUser.setTime(event.target.valueAsNumber); // javascript timestamps are in milliseconds
        this.setState({ invalidStartDate: (inputDateFromUser.getDay() !== 0), startDate: event.target.valueAsNumber });
        event.persist();
    }

    private handleChangeIntervalEndDate = (event: any) => {
        const inputDateFromUser = new Date();
        inputDateFromUser.setTime(event.target.valueAsNumber); // javascript timestamps are in milliseconds
        this.setState({ invalidEndDate: (inputDateFromUser.getDay() !== 6), endDate: event.target.valueAsNumber });
        event.persist();
    }

    private handleChangeRegion = (event: any) => {
        this.setState({ region: event.target.value });
        event.persist();
    }
}

export default Historical;
