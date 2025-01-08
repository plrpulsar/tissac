async function approveTokens() {
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
                { "internalType": "address", "name": "spender", "type": "address" },
                { "internalType": "uint256", "name": "amount", "type": "uint256" }
            ],
            "name": "approve",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ], signer);

    const amountInWei = ethers.utils.parseUnits(amount, 18);
    const tx = await tokenContract.approve(contractAddress, amountInWei);
    await tx.wait();
    alert("Tokens aprobados correctamente.");
}
