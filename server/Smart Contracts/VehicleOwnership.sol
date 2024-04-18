// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VehicleOwnership is ERC1155 {
    address public owner;
    uint256 private _currentTokenId;

    // Struct to hold vehicle attributes
    struct VehicleAttributes {
        string vid;
        // string vin;
        // string make;
        // string model;
        // string manufacturingSpecs;
        // string maintenanceRecords;
        // Add more attributes as needed
    }

    // Mapping from token ID to VehicleAttributes
    mapping(uint256 => VehicleAttributes) private _tokenAttributes;

    // Mapping from token ID to owner
    mapping(uint256 => address) private _owners;

    mapping (address => bytes32) private _verificationCodes;

    constructor(string memory uri_) ERC1155(uri_) {
        owner = msg.sender;
        _currentTokenId = 1;
    }

    function generateRandomHash(address _address) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_address));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Function to mint a new ERC1155 token representing a vehicle
    function mintVehicle(
        address account,
        string memory vid,
        // string memory vin,
        // string memory make,
        // string memory model,
        // string memory manufacturingSpecs,
        // string memory maintenanceRecords,
        uint256 amount
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _currentTokenId++;
        _mint(account, tokenId, amount, "");
        _tokenAttributes[tokenId] = VehicleAttributes(vid);
        _owners[tokenId] = account; // Set the owner of the new token
        return tokenId;
    }

    // Function to retrieve the attributes of a specific token
    function getAttributes(uint256 tokenId) external view returns (VehicleAttributes memory) {
        return _tokenAttributes[tokenId];
    }

    // Function to transfer ownership of a vehicle token
    function transferOwnership(
        address from,
        address to,
        uint256 tokenId,
        uint256 amount
    ) external {
        require(msg.sender == from, "Only owner can transfer ownership");
        require(_owners[tokenId] == from, "Sender does not own the token");
        safeTransferFrom(from, to, tokenId, amount, "");
        _owners[tokenId] = to; // Update the owner of the token
        _verificationCodes[to] = generateRandomHash(to);
    }

    function getVerificationCode(
        address ownr
    ) external view returns (bytes32) {
        require(msg.sender == ownr || msg.sender == owner, "Unauthorised Access to Verification Code");
        return _verificationCodes[ownr];
    }

    function verifyVehicleOwner(
        address ownr,
        uint256 tokenId,
        string memory vid
    ) external view returns (bool) {
        if (_owners[tokenId] != ownr) return false;
        VehicleAttributes storage attributes = _tokenAttributes[tokenId];
        if (keccak256(bytes(attributes.vid)) != keccak256(bytes(vid))) return false;
        return true;
    }
}