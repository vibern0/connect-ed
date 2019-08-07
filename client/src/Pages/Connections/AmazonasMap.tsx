import React, { Component } from 'react';
import amazonas from './amazonas.json';


import { scaleLinear } from 'd3-scale';
import {
    Annotation,
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from 'react-simple-maps';

const wrapperStyles = {
    margin: '0 auto',
    maxWidth: 720,
    width: '100%',
};

const popScale = scaleLinear()
    .domain([0, 100000000, 1400000000])
    .range(['#CFD8DC', '#607D8B', '#37474F'] as any);

class AmazonasMap extends Component<{}, {}> {
    public handleClick = () => {
        console.log("slkfmdslkfm");
    }

    public render() {
        return (
            <div style={wrapperStyles}>
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
                        <Annotation
                            dx={40}
                            dy={-30}
                            subject={[-65, -4]}
                            strokeWidth={1}
                            stroke="#607D8B"
                        >
                            <text>{"Guadaloupe"}</text>
                        </Annotation>
                    </ZoomableGroup>
                </ComposableMap>
            </div>
        );
    }

    private renderGeography = (geographies: any, projection: any) => {
        return geographies.map((geography: any, i: any) => (
            <Geography
                key={i}
                geography={geography}
                projection={projection}
                onClick={this.handleClick}
                style={{
                    default: {
                        fill: popScale((geography as any).properties.pop_est),
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                    },
                    hover: {
                        fill: "#263238",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                    },
                    pressed: {
                        fill: "#263238",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                    }
                } as any}
            />
        ));
    }
}

export default AmazonasMap;
