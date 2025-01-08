// Manejo de errores en approveTokens
async function approveTokens() {
    try {
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
        document.getElementById("counter").textContent = "Esperando confirmación...";
        await tx.wait();
        document.getElementById("counter").textContent = "Tokens aprobados correctamente.";
    } catch (error) {
        console.error("Error en la aprobación de tokens:", error);
        alert("Error al aprobar tokens. Revisa la consola para más detalles.");
    }
}

// Manejo de errores en sacrificeTokens
async function sacrificeTokens() {
    try {
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
        document.getElementById("counter").textContent = "Procesando transacción...";
        const tx = await tokenContract.transferFrom(userAddress, sacrificeAddress, amountInWei);
        await tx.wait();
        alert(`Sacrificio exitoso de ${amount} ${token}. ¡Recibiste TIS!`);
        const currentCount = parseInt(document.getElementById("counter").textContent.split(": ")[1]) || 0;
        document.getElementById("counter").textContent = `Transacciones: ${currentCount + 1}`;
    } catch (error) {
        console.error("Error en el sacrificio de tokens:", error);
        alert("Error al sacrificar tokens. Revisa la consola para más detalles.");
    }
}
