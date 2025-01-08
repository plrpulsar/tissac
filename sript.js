document.addEventListener("DOMContentLoaded", () => {
    let web3;
    let contract;
    const contractAddress = "0xE0c77dc2B8021C971c7c997127ff17b3Ed45F8eD";

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
        },
        {
            "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
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

    const connectWalletButton = document.getElementById("connectWallet");
    const sacrificeButton = document.getElementById("sacrificeButton");
    const tokenSelect = document.getElementById("tokenSelect");
    const sacrificeAmount = document.getElementById("sacrificeAmount");

    connectWalletButton.addEventListener("click", async () => {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            contract = new web3.eth.Contract(abi, contractAddress);
            alert("Wallet conectada correctamente.");
        } else {
            alert("Por favor instala MetaMask para continuar.");
        }
    });

    sacrificeButton.addEventListener("click", async () => {
        if (!web3) {
            alert("Primero conecta tu wallet.");
            return;
        }
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];
        const tokenAddress = tokenSelect.value;
        const amount = web3.utils.toWei(sacrificeAmount.value, "ether");

        try {
            await contract.methods.transfer(tokenAddress, amount).send({
                from: userAddress,
                gasPrice: web3.utils.toWei("100", "gwei"),
            });
            alert("Sacrificio realizado con éxito.");
        } catch (error) {
            console.error(error);
            alert("Error al realizar el sacrificio.");
        }
    });
});
