import React, { Component } from 'react';
import Navbar from '../../Components/Navbar';


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
                <form onSubmit={this.handleSubmitDonate}>
                    <input
                        type="text"
                        name="donationAmount"
                        value={donationAmount}
                        onChange={this.handleDonationAmountChange}
                    />
                    <input
                        type="submit"
                    />
                </form>
            </>
        );
    }
}

export default Donate;
