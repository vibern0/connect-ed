import { Connect } from 'uport-connect';

const getUport = () => {
    const uport = new Connect('Connect-Ed', {
        bannerImage: { '/': '/ipfs/QmdXeiHuqsBgwuDbQi2CkzBRtbgzZpc7jAUXJcYkdZs6nb' },
        description: 'Welcome to connect-ed.',
        network: 'ropsten',
        profileImage: { '/': '/ipfs/QmWojBnSsrpBiddLiTudoM4RnbnahmLE3TWm8jyZzKmgRB' },
    });
    return uport;
};

export default getUport;
