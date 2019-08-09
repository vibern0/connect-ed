pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./Accounts.sol";

/**
 * Contract to maintain donations
 */
contract Donations is Ownable {

    mapping(address => uint256) private donations;
    mapping(uint256 => address) private regionAdmin;
    mapping(address => uint256) private adminOfRegion;
    address[] public donors;
    address private accountsContractAddress;

    /**
     * constructor, receiving accounts contract address
     */
    constructor(address _accountsContractAddress) public {
        accountsContractAddress = _accountsContractAddress;
    }

    /**
     * modifier to only region admins
     */
    modifier onlyRegionAdmin(uint256 _region) {
        require(adminOfRegion[msg.sender] == _region, "Not allowed!");
        _;
    }

    /**
     * withdraw the needed amount to a region
     * @param _amount the amount to withdraw
     */
    function requestWithdraw(uint256 _amount) public onlyRegionAdmin(adminOfRegion[msg.sender]) {
        uint256 currentBalance = address(this).balance;
        require(_amount <= currentBalance, "Not enought!");
        msg.sender.transfer(_amount);
    }

    /**
     * used by contract owner to set region admin
     * @param _region region to set admin
     * @param _adminDid the admin address
     */
    function setRegionAdmin(uint256 _region, string memory _adminDid) public onlyOwner {
        Accounts accounts = Accounts(accountsContractAddress);
        (address adminAddress,) = accounts.getUser(_adminDid);
        require(adminAddress != address(0), "Not allowed!");
        accountsContractAddress.delegatecall(abi.encodePacked(
            bytes4(keccak256("setUserRole(string,uint256)")), _adminDid, uint256(3)
        ));
        adminOfRegion[adminAddress] = _region;
        regionAdmin[_region] = adminAddress;
    }

    /**
     * get region admin
     * @param _region region's id
     */
    function getRegionAdmin(uint256 _region) public view returns(address) {
        return regionAdmin[_region];
    }

    /**
     * fallback function to receive donations
     * does not requires login, can be anonymous
     */
    function () external payable {
        // if the using is giving ETH for the first time, add it to the list
        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        // receive ETH and save donated amount
        donations[msg.sender] = donations[msg.sender] + msg.value;
    }
}
