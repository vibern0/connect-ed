pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./Accounts.sol";

/**
 * Contract to maintain donations
 */
contract ISP is Ownable {

    struct DataFile {
        string ipfsHash;
        string md5;
        address isp;
        uint256 region;
        uint256 timestamp;
    }
    DataFile[] private dataFiles;
    mapping(address => uint256) private ispOfRegion;
    address private accountsContractAddress;

    /**
     * constructor, receiving accounts contract address
     */
    constructor(address _accountsContractAddress) public {
        accountsContractAddress = _accountsContractAddress;
    }

    /**
     * modifier to use with isps
     */
    modifier onlyISPOfRegion(uint256 _region) {
        require(ispOfRegion[msg.sender] == _region, "Not allowed!");
        _;
    }

    /**
     * set region isp
     * @param _region region to set isp
     * @param _ispDid isp's did
     */
    function setRegionISP(uint256 _region, string memory _ispDid) public onlyOwner {
        Accounts accounts = Accounts(accountsContractAddress);
        require(accounts.isValidAccount(_ispDid), "Not allowed!");
        // TODO: call it using msg.sender address
        accounts.setUserRole(_ispDid, 2);
        // TODO: set using public variable
        // User memory isp = users[_ispDid];
        // ispOfRegion[isp.addr] = _region;
    }

    /**
     * isps upload data file about connectivity
     * @param _ipfsHash hash of the ipfs file location
     * @param _md5 file's md5
     * @param _ispDid isp's did
     * @param _region map region to where the data belongs
     */
    function uploadDataFile(
        string memory _ipfsHash,
        string memory _md5,
        string memory _ispDid,
        uint256 _region
    ) public onlyISPOfRegion(_region) {
        // TODO: use public data
        // User memory isp = users[_ispDid];
        address ispAddr = 0x6fb7f543f7F5f0D225F7861827a3FEAC2A4266f6;
        DataFile memory dataFile = DataFile(_ipfsHash, _md5, ispAddr, _region, block.timestamp);
        dataFiles.push(dataFile);
    }

    /**
     * get the data file array
     */
    function getDataFiles() public view returns(DataFile[] memory) {
        return dataFiles;
    }
}
