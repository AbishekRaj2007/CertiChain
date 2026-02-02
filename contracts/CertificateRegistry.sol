// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Certificate {
        string studentName;
        string courseName;
        string ipfsHash;
        address issuer;
        uint256 issuedTimestamp;
        bool isValid;
    }

    mapping(string => Certificate) public certificates;
    mapping(string => bool) public certificateExists;

    event CertificateIssued(string indexed certificateId, string studentName, address indexed issuer);
    event CertificateRevoked(string indexed certificateId);

    modifier onlyIssuer(string memory _certificateId) {
        require(msg.sender == certificates[_certificateId].issuer, "Only issuer can revoke");
        _;
    }

    function issueCertificate(
        string memory _certificateId,
        string memory _studentName,
        string memory _courseName,
        string memory _ipfsHash
    ) public {
        require(!certificateExists[_certificateId], "Certificate ID already exists");

        certificates[_certificateId] = Certificate({
            studentName: _studentName,
            courseName: _courseName,
            ipfsHash: _ipfsHash,
            issuer: msg.sender,
            issuedTimestamp: block.timestamp,
            isValid: true
        });

        certificateExists[_certificateId] = true;

        emit CertificateIssued(_certificateId, _studentName, msg.sender);
    }

    function verifyCertificate(string memory _certificateId) public view returns (
        string memory studentName,
        string memory courseName,
        string memory ipfsHash,
        address issuer,
        uint256 issuedTimestamp,
        bool isValid
    ) {
        require(certificateExists[_certificateId], "Certificate does not exist");
        Certificate memory cert = certificates[_certificateId];
        
        return (
            cert.studentName,
            cert.courseName,
            cert.ipfsHash,
            cert.issuer,
            cert.issuedTimestamp,
            cert.isValid
        );
    }

    function revokeCertificate(string memory _certificateId) public onlyIssuer(_certificateId) {
        require(certificateExists[_certificateId], "Certificate does not exist");
        require(certificates[_certificateId].isValid, "Certificate already revoked");

        certificates[_certificateId].isValid = false;
        emit CertificateRevoked(_certificateId);
    }
}
