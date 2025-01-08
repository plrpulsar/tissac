async function sacrificeTokens() {
    const token = document.getElementById("tokenSelect").value;
    const amount = document.getElementById("sacrificeAmount").value;

    if (amount <= 0) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
    }

    currentTokenAddress = contracts[token];
    const tokenContract = new ethers.Contract(currentTokenAddress, [
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
    ], signer);

    const amountInWei = ethers.utils.parseUnits(amount, 18);
    const tx = await tokenContract.transferFrom(userAddress, sacrificeAddress, amountInWei);
    await tx.wait();
    alert(`Sacrificio exitoso de ${amount} ${token}. ¡Recibiste TIS!`);
}
