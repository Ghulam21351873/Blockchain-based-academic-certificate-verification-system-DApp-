const contractAddress = '0x2910D5C65c25F13e9D698FFe6f9D04dd956b1938'; // Your deployed contract address
const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "studentId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "certificateHash",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "CertificateIssued",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "certificateHash",
                "type": "string"
            }
        ],
        "name": "CertificateRevoked",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_studentId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_certificateHash",
                "type": "string"
            }
        ],
        "name": "issueCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_certificateHash",
                "type": "string"
            }
        ],
        "name": "revokeCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "certificates",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "studentId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "certificateHash",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isRevoked",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "university",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_certificateHash",
                "type": "string"
            }
        ],
        "name": "verifyCertificate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "studentId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isValid",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let contract;

window.addEventListener('load', async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);

        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Initialize contract
            contract = new web3.eth.Contract(abi, contractAddress);
            console.log('Contract initialized:', contract);

            // Set up button event listeners
            document.getElementById('issueButton').addEventListener('click', issueCertificate);
            document.getElementById('verifyButton').addEventListener('click', verifyCertificate);
            document.getElementById('revokeButton').addEventListener('click', revokeCertificate);

        } catch (error) {
            console.error('User denied account access or error:', error);
            alert('Please allow access to MetaMask!');
        }
    } else {
        alert('Please install MetaMask!');
    }
});

async function issueCertificate() {
    const studentId = document.getElementById('studentId').value;
    const certificateHash = document.getElementById('certificateHash').value;

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    try {
        await contract.methods.issueCertificate(studentId, certificateHash).send({ from: accounts[0] });
        alert('Certificate Issued!');
    } catch (error) {
        console.error("Error issuing certificate:", error);
        alert('Failed to issue certificate. Check the console for details.');
    }
}

async function verifyCertificate() {
    const verifyHash = document.getElementById('verifyHash').value;

    try {
        const result = await contract.methods.verifyCertificate(verifyHash).call();
        const studentId = result[0];
        const isValid = result[1];

        const verificationResult = isValid ? `Certificate is valid. Student ID: ${studentId}` : 'Certificate is revoked or not found.';
        document.getElementById('verificationResult').innerText = verificationResult;
    } catch (error) {
        console.error("Error verifying certificate:", error);
        document.getElementById('verificationResult').innerText = 'Verification failed. Check the console for details.';
    }
}

async function revokeCertificate() {
    const revokeHash = document.getElementById('revokeHash').value;

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    try {
        await contract.methods.revokeCertificate(revokeHash).send({ from: accounts[0] });
        alert('Certificate Revoked!');
    } catch (error) {
        console.error("Error revoking certificate:", error);
        alert('Failed to revoke certificate. Check the console for details.');
    }
}


