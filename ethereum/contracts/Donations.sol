pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./Accounts.sol";

/**
 * Contract to maintain donations
 */
contract Donations is Ownable {

    mapping(address => uint256) private donations;
    mapping(address => uint256) public adminOfRegion;
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
     * withdraw the needed ammount to a region
     * @param _ammount the ammount to withdraw
     */
    function withdraw(uint256 _ammount) public onlyRegionAdmin(adminOfRegion[msg.sender]) {
        uint256 currentBalance = address(this).balance;
        require(_ammount <= currentBalance, "Not enought!");
        // transfer(msg.sender, _ammount); // TODO: does this works?
    }

    /**
     * used by contract owner to set region admin
     * @param _region region to set admin
     * @param _adminDid the admin address
     */
    function setRegionAdmin(uint256 _region, string memory _adminDid) public onlyOwner {
        Accounts accounts = Accounts(accountsContractAddress);
        require(accounts.isValidAccount(_adminDid), "Not allowed!");
        // TODO: call it using msg.sender address
        // accounts.setUserRole(_adminDid, 3);
        accountsContractAddress.delegatecall(abi.encodePacked(
            bytes4(keccak256("setUserRole(string,uint256)")), _adminDid, uint256(3)
        ));
        // TODO: set role using address
        // Accounts.User storage user = accounts.users(_adminDid);
        // adminOfRegion[user.addr] = _region;
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
        // receive ETH and save donated ammount
        donations[msg.sender] = donations[msg.sender] + msg.value;
    }
}
