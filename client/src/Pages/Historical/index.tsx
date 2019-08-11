import React, { Component } from 'react';
import { Button, Checkbox, Form, Heading, Text } from 'rimble-ui';
import styled from 'styled-components';
import Cookies from 'universal-cookie';

import BlockchainGeneric, { IBasicComponentState, ipfs } from '../../Common';
import Navbar from '../../Components/Navbar';
import getUport from '../../utils/getUport';


const Content = styled.div`
    margin: 0px 20%;
`;
class Historical extends Component<{}, IBasicComponentState> {
    private uploadingFileBuffer: Buffer = undefined as any;

    constructor(props: any) {
        super(props);
        this.state = {
            accountsContract: undefined as any,
            cookies: new Cookies(),
            uport: getUport(),
            userAccount: '',
            web3: undefined as any,
        };
    }

    public componentDidMount = async () => {
        const generic = await BlockchainGeneric.onLoad();
        const accountsContract = await BlockchainGeneric.loadAccountsContract(generic.web3);
        this.setState({
            accountsContract,
            userAccount: generic.userAccount,
            web3: generic.web3,
        });
    }

    public handleSubmit = (event: any) => {
        // upload file
        ipfs.add(this.uploadingFileBuffer).then((results: [{ path: string }]) => {
            console.log(results);
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
        const { cookies, userAccount, accountsContract, uport } = this.state;
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
                        <Form.Field label="Data File to Upload" width={1}>
                            <Form.Input
                                width="100%"
                                id="my_file_upload"
                                required={true}
                                type="file"
                                onChange={this.captureFile}
                            />
                        </Form.Field>
                        <Checkbox label="Your agree with the terms and conditions" required={true} />
                        <br /><br />
                        <Button type="submit" width={1}>Upload</Button>
                    </Form>
                </Content>
                <br />
                <br />
                <br />
            </>
        );
    }
}

export default Historical;
