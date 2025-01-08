const { ethers } = require("ethers");

const contractAddress = "0xE0c77dc2B8021C971c7c997127ff17b3Ed45F8eD"; // Dirección del contrato

const contractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let provider;
let signer;
let contract;
let userAddress;

let transactionCounter = 0;

async function initialize() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            // Solicitar al usuario que conecte su billetera (MetaMask)
            await ethereum.request({ method: 'eth_requestAccounts' });

            userAddress = await signer.getAddress();
            document.getElementById("walletAddress").getElementsByTagName('span')[0].innerText = userAddress;
            
            // Actualizar el estado de la billetera
            document.getElementById("connectWallet").innerText = "Billetera Conectada";
            document.getElementById("connectWallet").disabled = true;

            // Establecer el proveedor de eventos para cambios en la red o cuenta de MetaMask
            ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    alert("MetaMask desconectada");
                    document.getElementById("walletAddress").getElementsByTagName('span')[0].innerText = "Desconocido";
                    document.getElementById("connectWallet").innerText = "Conectar Wallet";
                    document.getElementById("connectWallet").disabled = false;
                } else {
                    userAddress = accounts[0];
                    document.getElementById("walletAddress").getElementsByTagName('span')[0].innerText = userAddress;
                }
            });

            ethereum.on('chainChanged', (chainId) => {
                window.location.reload();
            });
        } catch (error) {
            alert("No se pudo conectar a MetaMask: " + error.message);
        }
    } else {
        alert("Por favor instala MetaMask");
    }
}

async function getBalance() {
    if (!provider || !contract) {
        alert("No se ha inicializado correctamente el proveedor o el contrato.");
        return;
    }

    try {
        const balance = await contract.balanceOf(userAddress);
        const formattedBalance = ethers.utils.formatUnits(balance, 18);  // Suponiendo que el token tiene 18 decimales
        document.getElementById("balanceResult").getElementsByTagName('span')[0].innerText = formattedBalance;

        // Establecer el saldo en el campo de sacrificio de tokens
        document.getElementById("sacrificeAmount").value = formattedBalance;
    } catch (error) {
        alert("Error al obtener el saldo: " + error.message);
    }
}

async function sacrificeTokens() {
    const amountToSacrifice = document.getElementById("sacrificeAmount").value;

    // Validación de la cantidad ingresada
    if (isNaN(amountToSacrifice) || amountToSacrifice <= 0) {
        alert("Por favor ingrese una cantidad válida para sacrificar.");
        return;
    }

    try {
        const amountInWei = ethers.utils.parseUnits(amountToSacrifice, 18); // Asegurarse de que el número esté en la unidad correcta
        const tx = await contract.transfer("0x000000000000000000000000000000000000dEaD", amountInWei); // Dirección de quema
        console.log("Transacción en progreso: ", tx.hash);
        
        // Esperar que la transacción se confirme
        await tx.wait();

        // Actualizar contador
        transactionCounter++;
        document.getElementById("counter").innerText = `Transacciones: ${transactionCounter}`;
        alert(`¡Sacrificio exitoso! Transacción: ${tx.hash}`);
    } catch (error) {
        alert("Error al sacrificar tokens: " + error.message);
    }
}

// Inicializar la aplicación
document.getElementById("connectWallet").addEventListener("click", initialize);
document.getElementById("getBalance").addEventListener("click", getBalance);
document.getElementById("sacrificeTokens").addEventListener("click", sacrificeTokens);
