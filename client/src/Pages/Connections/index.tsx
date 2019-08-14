import ipfsClient from 'ipfs-http-client';
import React, { Component } from 'react';
import { Input, Field, Text, Heading } from 'rimble-ui';
import Cookies from 'universal-cookie';

import BlockchainGeneric, { IBasicComponentState } from '../../Common';
import getUport from '../../utils/getUport';

import Navbar from '../../Components/Navbar';
import AmazonasMap, { IRegionData } from './AmazonasMap';


const ipfs = ipfsClient({
    host: process.env.REACT_APP_IPFS_HOST,
    port: process.env.REACT_APP_IPFS_PORT,
    protocol: process.env.REACT_APP_IPFS_PROTOCOL,
});
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
    ipfsDataFileData: string;
}
/**
 * Connections component for /connection route.
 * It loads some static fake data into a d3 map, with real geographycal information
 * and allows the user to view uploaded data by ISP for a given region.
 */
class Connections extends Component<{}, IConnectionsState> {

    private loadingIpfsDataFile: boolean = false;

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
            ipfsDataFileData: '',
        };
    }

    public componentDidMount = async () => {
        const generic = await BlockchainGeneric.onLoad();
        const accountsContract = await BlockchainGeneric.loadAccountsContract(generic.web3);
        const ispContract = await BlockchainGeneric.loadISPContract(generic.web3);
        let dataFileEntries = [];
        try {
            dataFileEntries = await ispContract.getDataFiles();
            console.log('dataFileEntries', dataFileEntries);
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
            dataFileEntries,
            ipfsDataFileData,
        } = this.state;
        // TODO: load datafile entry for a region
        let renderRegionData;
        if (regionData !== undefined) {

            if (this.loadingIpfsDataFile) {
                const dataJson = JSON.parse(ipfsDataFileData);
                renderRegionData = (
                    <>
                        <Heading.h2>Available data</Heading.h2>
                        <p>Region code: {regionData.cod}</p>
                        <p>Region Connection Average Speed: {regionData.conn_speed_avg}</p>
                        <br />
                        <Heading.h3>Available data uploaded to IPFS</Heading.h3>
                        <Text>Monday: {dataJson.monday}</Text>
                        <Text>Tuesday: {dataJson.tuesday}</Text>
                        <Text>Wednesday: {dataJson.wednesday}</Text>
                        <Text>Thursday: {dataJson.thursday}</Text>
                        <Text>Friday: {dataJson.friday}</Text>
                        <Text>Saturday: {dataJson.saturday}</Text>
                        <Text>Sunday: {dataJson.sunday}</Text>
                    </>
                );
                this.loadingIpfsDataFile = false;
            } else {
                const informationRegion = dataFileEntries.filter((d) => parseInt(d.region, 10) === regionData.cod)[0];
                renderRegionData = (
                    <>
                        <Heading.h2>Available data</Heading.h2>
                        <p>Region code: {regionData.cod}</p>
                        <p>Region Connection Average Speed: {regionData.conn_speed_avg}</p>
                        <br />
                        {informationRegion !== undefined && (<p>Loading...</p>)}
                    </>
                );
                if (informationRegion !== undefined) {
                    ipfs.get(informationRegion.ipfsHash, (err: any, files: any) => {
                        this.setState({ ipfsDataFileData: files[0].content.toString('utf8')});
                        this.loadingIpfsDataFile = true;
                    });
                }
            }
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

    /**
     * Handle input change
     */
    private handleChangeIntervalStartDate = (event: any) => {
        const inputDateFromUser = new Date();
        inputDateFromUser.setTime(event.target.valueAsNumber); // javascript timestamps are in milliseconds
        this.setState({ invalidStartDate: (inputDateFromUser.getDay() !== 0), regionData: undefined as any });
        event.persist();
    }

    /**
     * Handle input change
     */
    private handleChangeIntervalEndDate = (event: any) => {
        const inputDateFromUser = new Date();
        inputDateFromUser.setTime(event.target.valueAsNumber); // javascript timestamps are in milliseconds
        this.setState({ invalidEndDate: (inputDateFromUser.getDay() !== 6), regionData: undefined as any });
        event.persist();
    }

    /**
     * Update when mouse moves over regions
     */
    private toggleAreaMessage = (regionData: IRegionData) => {
        this.setState({ regionData });
    }
}

export default Connections;
