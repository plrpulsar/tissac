let provider, signer, contract, userAddress;

const contractAddress = "0x16E0Adc89269E9c0F4f14B5b0AF786365ACBaC6b"; // Dirección del contrato
const tokenAddress = "0xTokenAddressHere"; // Dirección del token (reemplázalo si tienes la dirección del token)
const contractABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "spender", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "recipient", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "transfer",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

async function initialize() {
    if (typeof window.ethereum !== "undefined") {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            document.getElementById("walletAddress").getElementsByTagName('span')[0].innerText = userAddress;

            contract = new ethers.Contract(contractAddress, contractABI, signer); // Usamos la nueva dirección de contrato

            const symbol = await contract.symbol();
            document.getElementById("tokenSymbol").innerText = symbol;

            document.getElementById("connectWallet").innerText = "Billetera Conectada";
            document.getElementById("connectWallet").disabled = true;
        } catch (error) {
            alert("Error al conectar la billetera: " + error.message);
        }
    } else {
        alert("MetaMask no está instalada. Por favor, instálala desde https://metamask.io/");
    }
}

document.getElementById("connectWallet").addEventListener("click", initialize);
