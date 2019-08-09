import React, { Component } from 'react';
import { Button, Form, Heading, Text } from 'rimble-ui';
import styled from 'styled-components';
import Navbar from '../../Components/Navbar';


const Content = styled.div`
    margin: 0px 20%;
`;
interface IDonateState {
    donationAmount: string;
}
class Donate extends Component<{}, IDonateState> {

    constructor(props: any) {
        super(props);
        this.state = {
            donationAmount: '',
        };
    }

    public handleSubmitDonate = (event: any) => {
        // TODO: submit donation
        event.preventDefault();
    }

    public handleDonationAmountChange = (event: any) => {
        this.setState({ donationAmount: event.target.value });
    }

    public render() {
        const { donationAmount } = this.state;
        return (
            <>
                <Navbar />
                <Content>
                    <br />
                    <br />
                    <br />
                    <div style={{ textAlign: 'center'}}>
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
                        <Form.Field label="Amount to Donate" width={1}>
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
                </Content>
            </>
        );
    }
}

export default Donate;
