import React, { Component } from 'react';
import { Input, Field, Text, Heading } from 'rimble-ui';
import Cookies from 'universal-cookie';

import BlockchainGeneric, { IBasicComponentState } from '../../Common';
import getUport from '../../utils/getUport';

import Navbar from '../../Components/Navbar';
import AmazonasMap, { IRegionData } from './AmazonasMap';


interface IDataFileEntry {
    ipfsHash: any;
    isp: any;
    md5: any;
    region: any;
    timestamp: any;
}
interface IConnectionsState extends IBasicComponentState {
    regionData: IRegionData;
    invalidStartDate: boolean;
    invalidEndDate: boolean;
    ispContract: any;
    dataFileEntries: IDataFileEntry[];
}
class Connections extends Component<{}, IConnectionsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            accountsContract: undefined as any,
            cookies: new Cookies(),
            dataFileEntries: [],
            invalidEndDate: false,
            invalidStartDate: false,
            ispContract: undefined as any,
            regionData: undefined as any,
            uport: getUport(),
            userAccount: '',
            web3: undefined as any,
        };
    }

    public componentDidMount = async () => {
        const generic = await BlockchainGeneric.onLoad();
        const accountsContract = await BlockchainGeneric.loadAccountsContract(generic.web3);
        const ispContract = await BlockchainGeneric.loadISPContract(generic.web3);
        let dataFileEntries = [];
        try {
            dataFileEntries = await ispContract.getDataFiles();
        } catch (e) {
            // no need to report error, only happens if there's no entries
        }
        this.setState({
            accountsContract,
            dataFileEntries,
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
            regionData,
            invalidStartDate,
            invalidEndDate,
        } = this.state;
        // TODO: load datafile entry for a region
        let renderRegionData;
        if (regionData !== undefined) {
            renderRegionData = (
                <>
                    <Heading.h2>Available data</Heading.h2>
                    <p>Region code: {regionData.cod}</p>
                    <p>Region Connection Average Speed: {regionData.conn_speed_avg}</p>
                </>
            );
        }
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
                <AmazonasMap toggleInArea={this.toggleAreaMessage} />
                <div style={{ float: 'right' as 'right', margin: '0px 9% 0px auto' }}>
                    <Text>By default, the data being show corresponds to the last week.</Text>
                    <Text>Changes dates as you wish, being the start date any sunday and end date any saturday.</Text>
                    <br />
                    <br />
                    <Field label="Start Date">
                        <Input
                            borderColor={invalidStartDate ? 'red' : 'grey'}
                            type="date"
                            onChange={this.handleChangeIntervalStartDate}
                        />
                    </Field>
                    <Field label="End Date">
                        <Input
                            borderColor={invalidEndDate ? 'red' : 'grey'}
                            type="date"
                            onChange={this.handleChangeIntervalEndDate}
                        />
                    </Field>
                    <br />
                    <br />
                    {renderRegionData}
                </div>
            </>
        );
    }

    private handleChangeIntervalStartDate = (event: any) => {
        const inputDateFromUser = new Date();
        inputDateFromUser.setTime(event.target.valueAsNumber); // javascript timestamps are in milliseconds
        this.setState({ invalidStartDate: (inputDateFromUser.getDay() !== 0), regionData: undefined as any });
        event.persist();
    }

    private handleChangeIntervalEndDate = (event: any) => {
        const inputDateFromUser = new Date();
        inputDateFromUser.setTime(event.target.valueAsNumber); // javascript timestamps are in milliseconds
        this.setState({ invalidEndDate: (inputDateFromUser.getDay() !== 6), regionData: undefined as any });
        event.persist();
    }

    private toggleAreaMessage = (regionData: IRegionData) => {
        this.setState({ regionData });
    }
}

export default Connections;
