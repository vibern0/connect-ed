import React, { Component } from 'react';
import { Button, Form, Box, Input } from 'rimble-ui';
import Navbar from '../../Components/Navbar';


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
            <Form onSubmit={this.handleSubmit}>
                <Form.Field validated={this.state.validated} label="Data to Upload" width={1}>
                    <Form.Input
                        id="my_file_upload"
                        required={true}
                        type="file"
                        onChange={this.selectFiles}
                    />
                </Form.Field>
                <Button type="submit" width={1}>
                    Sign Up
                </Button>
            </Form>
        );
    }
}

export default Historical;
