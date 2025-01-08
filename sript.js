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
let provider, signer, contract, userAddress;

const contractAddress = "0x16E0Adc89269E9c0F4f14B5b0AF786365ACBaC6b"; // Dirección del contrato TIS
const hexAddress = "0xHEXTokenAddress";  // Dirección de HEX en PulseChain
const plsAddress = "0xPLSTokenAddress";  // Dirección de PLS en PulseChain
const daiAddress = "0xDAITokenAddress";  // Dirección de DAI en PulseChain
const wethAddress = "0xWETHTokenAddress";  // Dirección de WETH en PulseChain

const tokenAddresses = {
    hex: hexAddress,
    pls: plsAddress,
    dai: daiAddress,
    weth: wethAddress
};

async function initialize() {
    if (typeof window.ethereum !== "undefined") {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            document.getElementById("walletAddress").getElementsByTagName('span')[0].innerText = userAddress;

            document.getElementById("connectWallet").innerText = "Billetera Conectada";
            document.getElementById("connectWallet").disabled = true;
        } catch (error) {
            alert("Error al conectar la billetera: " + error.message);
        }
    } else {
        alert("MetaMask no está instalada. Por favor, instálala desde https://metamask.io/");
    }
}

async function getBalance() {
    try {
        const selectedToken = document.getElementById("selectToken").value;
        const tokenAddress = tokenAddresses[selectedToken];
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
        
        const balance = await tokenContract.balanceOf(userAddress);
        const formattedBalance = ethers.utils.formatUnits(balance, 18); // Asumiendo 18 decimales
        document.getElementById("balanceResult").getElementsByTagName('span')[0].innerText = formattedBalance;
    } catch (error) {
        alert("Error al obtener el saldo: " + error.message);
    }
}

async function approveTokens() {
    try {
        const selectedToken = document.getElementById("selectToken").value;
        const amount = document.getElementById("sacrificeAmount").value;

        if (amount <= 0) {
            alert("Por favor, ingresa una cantidad válida.");
            return;
        }

        const amountInWei = ethers.utils.parseUnits(amount, 18);
        const tokenAddress = tokenAddresses[selectedToken];
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

        const tx = await tokenContract.approve(contractAddress, amountInWei);
        await tx.wait();
        alert("Tokens aprobados correctamente.");
    } catch (error) {
        alert("Error al aprobar tokens: " + error.message);
    }
}

async function sacrificeTokens() {
    try {
        const selectedToken = document.getElementById("selectToken").value;
        const amount = document.getElementById("sacrificeAmount").value;

        if (amount <= 0) {
            alert("Por favor, ingresa una cantidad válida.");
            return;
        }

        const amountInWei = ethers.utils.parseUnits(amount, 18);
        const tokenAddress = tokenAddresses[selectedToken];
        const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

        const tx = await tokenContract.transfer("0x000000000000000000000000000000000000dEaD", amountInWei); // Dirección de quema
        await tx.wait();
        alert("Tokens sacrificados correctamente.");
    } catch (error) {
        alert("Error al sacrificar tokens: " + error.message);
    }
}

document.getElementById("connectWallet").addEventListener("click", initialize);
document.getElementById("getBalance").addEventListener("click", getBalance);
document.getElementById("approveTokens").addEventListener("click", approveTokens);
document.getElementById("sacrificeTokens").addEventListener("click", sacrificeTokens);
