import styled from 'styled-components';
import amazonas from './amazonas.webp';

export const Background = styled.div`
    /* The image used */
    background-image: url(${amazonas});

    /* Full height */
    height: 100%;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    width: 100%;
    height: 880px;

    /* put it in the backgtround */
    position: absolute;
    z-index: -1;
    opacity: 0.5;
`;
export const Content = styled.div`
    text-align: center;
`;
