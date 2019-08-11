import React, { Component } from 'react';
import amazonas from './amazonas.json';


import { scaleLinear } from 'd3-scale';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from 'react-simple-maps';


import ReactTooltip from 'react-tooltip';

const wrapperStyles = {
    margin: '0 auto',
    maxWidth: 720,
    width: '100%',
};

const popScale = scaleLinear()
    .domain([0, 100000000, 1400000000])
    .range(['#CFD8DC', '#607D8B', '#37474F'] as any);

class AmazonasMap extends Component<{}, { geoName: string}> {

    constructor(props: any) {
        super(props);
        this.state = {
            geoName: '',
        };
    }

    public handleClick = (event: any) => {
        console.log(event.properties.conn_speed_avg);
    }

    public handleMove = (geography: any, evt: any) => {
        const { geoName } = this.state;
        const newGeoName = geography.properties.cod;
        if (geoName !== newGeoName) {
            this.setState({ geoName: newGeoName });
        }
    }

    public render() {
        return (
            <div style={wrapperStyles}>
                <ReactTooltip id="geoName" type="light">
                    <span>{this.state.geoName}</span>
                </ReactTooltip>
                <ComposableMap
                    projectionConfig={{ scale: 2767, rotation: [-11, 0, 0] }}
                    width={720}
                    height={551}
                    style={{ width: '100%', height: 'auto' }}
                >
                    <ZoomableGroup center={[-65, -4]}>
                        <Geographies geography={amazonas}>
                            {(geographies, projection) => this.renderGeography(geographies, projection)}
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
            </div>
        );
    }

    private renderGeography = (geographies: any, projection: any) => {
        return geographies.map((geography: any, i: any) => {
            const geoStyle = {
                default: {
                    fill: popScale((geography as any).properties.conn_speed_avg),
                    outline: 'none',
                    stroke: '#607D8B',
                    strokeWidth: 0.75,
                },
                hover: {
                    fill: '#263238',
                    outline: 'none',
                    stroke: '#607D8B',
                    strokeWidth: 0.75,
                },
                pressed: {
                    fill: '#263238',
                    outline: 'none',
                    stroke: '#607D8B',
                    strokeWidth: 0.75,
                },
            };
            return (
                <Geography
                    data-tip={true}
                    data-for="geoName"
                    key={i}
                    geography={geography}
                    projection={projection}
                    onClick={this.handleClick}
                    onMouseMove={this.handleMove}
                    style={geoStyle as any}
                />
            );
        });
    }
}

export default AmazonasMap;
