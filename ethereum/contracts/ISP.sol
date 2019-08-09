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
    mapping(uint256 => address) private regionISP;
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
        (address ispAddress,) = accounts.getUser(_ispDid);
        require(ispAddress != address(0), "Not allowed!");
        accountsContractAddress.delegatecall(abi.encodePacked(
            bytes4(keccak256("setUserRole(string,uint256)")), _ispDid, uint256(2)
        ));
        ispOfRegion[ispAddress] = _region;
        regionISP[_region] = ispAddress;
    }

    /**
     * get region admin
     * @param _region region's id
     */
    function getRegionISP(uint256 _region) public view returns(address) {
        return regionISP[_region];
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
        Accounts accounts = Accounts(accountsContractAddress);
        (address ispAddress,) = accounts.getUser(_ispDid);
        DataFile memory dataFile = DataFile(_ipfsHash, _md5, ispAddress, _region, block.timestamp);
        dataFiles.push(dataFile);
    }

    /**
     * get the data file array
     */
    function getDataFiles() public view returns(DataFile[] memory) {
        return dataFiles;
    }
}
