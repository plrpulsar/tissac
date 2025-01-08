let provider, signer, userAddress;

const sacrificeAddress = "0x90138bCcfD0280293fD8A82Bf79f51D7c4e0C921"; // Dirección para recibir los tokens sacrificados
const tokenContracts = {
    "INC": "0x8fa8c7ed3fa85c129b6ca3fa2cf0294b39c1b580",
    "HEX": "0xD2f9dF2e1e1c3b3b128D4cDe6b39D42F98e1a7C0",
    "WETH": "0x0B6e3A1D70b9F458742fD5A41570e529caE31bC2",
    "USDT": "0x2348f40c25609b7e9a079b29293edfe9b38d06a9",
    "PLS": "0x00e9e5db68b4385de66a33b68d30b079bc4a3ff2",
    "WPLS": "0x338ff3a1b2776c8bbbd8f1c4d63c64dd1f4287d3"
};

// Conectar billetera
async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        document.getElementById("walletAddress").getElementsByTagName('span')[0].innerText = userAddress;
        document.getElementById("connectWallet").innerText = "Billetera Conectada";
        document.getElementById("connectWallet").disabled = true;
    } else {
        alert("MetaMask no está instalada. Por favor, instálala desde https://metamask.io/");
    }
}

// Aprobar Tokens
async function approveTokens() {
    const token = document.getElementById("tokenSelect").value;
    const amount = document.getElementById("sacrificeAmount").value;

    if (amount <= 0) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
    }

    const tokenAddress = tokenContracts[token];
    const abi = [
        {
            "inputs": [
                { "internalType": "address", "name": "spender", "type": "address" },
                { "internalType": "uint256", "name": "amount", "type": "uint256" }
            ],
            "name": "approve",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    const tokenContract = new ethers.Contract(tokenAddress, abi, signer);

    const amountInWei = ethers.utils.parseUnits(amount, 18);
    const tx = await tokenContract.approve(sacrificeAddress, amountInWei);
    await tx.wait();
    alert(`Aprobaste ${amount} ${token} correctamente.`);
}

// Sacrificar Tokens
async function sacrificeTokens() {
    const token = document.getElementById("tokenSelect").value;
    const amount = document.getElementById("sacrificeAmount").value;

    if (amount <= 0) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
    }

    const tokenAddress = tokenContracts[token];
    const abi = [
        {
            "inputs": [
                { "internalType": "address", "name": "recipient", "type": "address" },
                { "internalType": "uint256", "name": "amount", "type": "uint256" }
            ],
            "name": "transferFrom",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    const tokenContract = new ethers.Contract(tokenAddress, abi, signer);

    const amountInWei = ethers.utils.parseUnits(amount, 18);
    const tx = await tokenContract.transferFrom(userAddress, sacrificeAddress, amountInWei);
    await tx.wait();
    alert(`Sacrificio exitoso de ${amount} ${token}.`);
}

// Eventos de los botones
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("approveTokens").addEventListener("click", approveTokens);
document.getElementById("sacrificeTokens").addEventListener("click", sacrificeTokens);
