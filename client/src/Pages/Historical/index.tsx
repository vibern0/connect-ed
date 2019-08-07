import React, { Component } from 'react';
import styled from 'styled-components'
import { Button, Form, Heading, Text, Checkbox } from 'rimble-ui';
import Navbar from '../../Components/Navbar';


const Content = styled.div`
    margin: 0px 20%;
`;
interface IHistoricalState {
    file: string;
    validated: boolean;
}
class Historical extends Component<{}, IHistoricalState> {

    constructor(props: any) {
        super(props);
        this.state = {
            file: '',
            validated: false,
        }
    }

    public handleSubmit = (e: any) => {
        console.log(this.state.file);
        // upload file
        e.preventDefault();
    }

    public selectFiles = (e: any) => {
        console.log('test');
        this.setState({ file: e.target.files[0] });
    }

    public render() {
        return (
            <>
                <Navbar />
                {this.renderUploadOption()}
            </>
        );
    }

    private renderUploadOption = () => {
        return (
            <Content>
                <br />
                <br />
                <br />
                <Heading.h2>Terms and Conditions</Heading.h2>
                <br />
                <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum dapibus convallis.
                    Nulla vel laoreet augue. In tincidunt felis sapien, vel molestie felis fringilla nec. Sed
                    ac malesuada tortor. Etiam tincidunt in arcu eget sollicitudin. Vestibulum tempus blandit
                    dui, pulvinar facilisis metus pharetra nec. Vivamus sed posuere massa. Aliquam accumsan ex
                    sit amet ullamcorper ultricies. Nullam ac felis nisl. In id dictum felis.</Text>
                <br /><br />
                <Text>Nunc eget sem vel dui ultricies scelerisque. Vestibulum nec luctus tortor. Praesent
                    pretium nisl nisl, a lacinia felis varius ac. Cras mattis dui eu sodales finibus. Cras
                    finibus placerat euismod. Fusce vestibulum quam id quam volutpat blandit. Ut vulputate
                    consequat nulla, quis posuere lectus finibus eu. Morbi dignissim at purus sit amet
                    vulputate. Cras nec vehicula leo. Suspendisse commodo lectus augue, at lobortis ligula
                    pellentesque in. Suspendisse mauris risus, consectetur ornare pulvinar eget, eleifend
                    ut elit. Praesent pretium quam eu felis luctus, eu interdum nisl consequat. Etiam
                    consectetur velit sed bibendum gravida. Vestibulum ultrices odio vel consequat facilisis.
                        Maecenas lobortis vehicula ullamcorper.</Text>
                <br /><br /><br />
                <Form onSubmit={this.handleSubmit} style={{ padding: '0px 30%' }}>
                    <Form.Field validated={this.state.validated} label="Data File to Upload" width={1}>
                        <Form.Input
                            id="my_file_upload"
                            required={true}
                            type="file"
                            onChange={this.selectFiles}
                        />
                    </Form.Field>
                    <Checkbox label="Your agree with the terms and conditions" required={true} />
                    <br /><br />
                    <Button type="submit" width={1}>Upload</Button>
                </Form>
            </Content>
        );
    }
}

export default Historical;
