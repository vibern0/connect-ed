pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";


contract Accounts is Ownable {

    event userSignedUp(string did, address addr);
    event userInvited(string did, uint256 role, address by);

    /**
     * Role 1 - Normal User; 2 - ISP; 3 - Region Admin
     */
    struct User {
        address addr;
        uint256 role;
    }
    mapping(string => User) private users;
    mapping(string => User) private invites;

    /**
     * @dev Modifier to check if the user is the valid user
     * by comparing the address in the did registry.
     */
    modifier onlyUser(string memory _did) {
        require(users[_did].addr == msg.sender, "Your are not the right user.");
        _;
    }

    /**
     * @dev Verifies if a user is signed.
     */
    function userExists(string memory _userDid) public view returns(bool) {
        return users[_userDid].addr != address(0);
    }

    /**
     * @dev The owner can invite other users to have specials roles in the system.
     */
    function invite(string memory _userDid, address _userAddress, uint256 _role) public onlyOwner {
        require(users[_userDid].addr == address(0), "User already exists!");
        require(invites[_userDid].addr == address(0), "User already invited!");
        User memory user = User(_userAddress, _role);
        invites[_userDid] = user;
        emit userInvited(_userDid, _role, msg.sender);
    }

    /**
     * @dev save msg.sender and uport did in order to be able
     * to verify if the user authenticity in future transactions.
     * This is an open method, but might require an invite.
     */
    function signup(string memory _userDid) public {
        User memory invitedUser = invites[_userDid];
        if (invitedUser.role != 0) {
            require(invitedUser.addr == msg.sender, "You are not allowed!");
            users[_userDid] = invitedUser;
            delete invites[_userDid];
        } else {
            User memory newUser = User(msg.sender, 1);
            users[_userDid] = newUser;
        }
        emit userSignedUp(_userDid, msg.sender);
    }

    /**
     * set user a sepecific role, only by contract owner
     * @param _userDid user's did
     * @param _role role id to the user
     */
    function setUserRole(string memory _userDid, uint256 _role) public onlyOwner {
        User memory user = invites[_userDid];
        user.role = _role;
        invites[_userDid] = user;
    }

    /**
     * get user information
     * @param _accountDid did of the account
     */
    function getUser(string memory _accountDid) public view returns(address, uint256) {
        return (users[_accountDid].addr, users[_accountDid].role);
    }
}
