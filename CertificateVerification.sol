// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


contract CertificateVerification {

    struct Certificate {

        uint256 studentId;

        string certificateHash;

        uint256 timestamp;

        bool isRevoked;

    }


    address public university; // University admin address

    mapping(string => Certificate) public certificates; // Mapping from certificate hash to Certificate


    event CertificateIssued(uint256 studentId, string certificateHash, uint256 timestamp);

    event CertificateRevoked(string certificateHash);


    modifier onlyUniversity() {

        require(msg.sender == university, "Only university can perform this action");

        _;

    }


    constructor() {

        university = msg.sender; // Set the deployer as the university

    }


    // Function to issue a certificate

    function issueCertificate(uint256 _studentId, string memory _certificateHash) public onlyUniversity {

        require(certificates[_certificateHash].timestamp == 0, "Certificate already issued");

        

        certificates[_certificateHash] = Certificate({

            studentId: _studentId,

            certificateHash: _certificateHash,

            timestamp: block.timestamp,

            isRevoked: false

        });


        emit CertificateIssued(_studentId, _certificateHash, block.timestamp);

    }


    // Function to verify a certificate

    function verifyCertificate(string memory _certificateHash) public view returns (uint256 studentId, bool isValid) {

        Certificate memory cert = certificates[_certificateHash];

        require(cert.timestamp != 0, "Certificate not found");

        

        return (cert.studentId, !cert.isRevoked);

    }


    // Function to revoke a certificate

    function revokeCertificate(string memory _certificateHash) public onlyUniversity {

        require(certificates[_certificateHash].timestamp != 0, "Certificate not found");

        require(!certificates[_certificateHash].isRevoked, "Certificate already revoked");


        certificates[_certificateHash].isRevoked = true;


        emit CertificateRevoked(_certificateHash);

    }

}