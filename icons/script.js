const connectButton = document.getElementById('connectButton');
const disconnectButton = document.getElementById('disconnectButton');
const outputDiv = document.getElementById('output');
let device; // Global variable to store the connected USBDevice

connectButton.addEventListener('click', async () => {
    try {
        // Request the user to select a USB device
        device = await navigator.usb.requestDevice({
            filters: [{ vendorId: 0x067b }] // Example: Filter for Arduino devices
        });

        await device.open(); // Open the device
        await device.selectConfiguration(1); // Select a configuration (usually 1)
        await device.claimInterface(0); // Claim an interface (e.g., interface 0)

        outputDiv.textContent = `Connected to: ${device.productName}`;
        connectButton.style.display = 'none';
        disconnectButton.style.display = 'initial';

        // Example: Send some data (replace with your device-specific logic)
        await device.transferOut(1, new Uint8Array([0x01, 0x02, 0x03])); 
        outputDiv.textContent += '\nData sent!';

        // Example: Read data (replace with your device-specific logic)
        const result = await device.transferIn(1, 64); // Endpoint 1, max packet size 64
        const receivedData = new TextDecoder().decode(result.data);
        outputDiv.textContent += `\nReceived: ${receivedData}`;

    } catch (error) {
        outputDiv.textContent = `Error: ${error.message}`;
        console.error(error);
    }
});

disconnectButton.addEventListener('click', async () => {
    if (device) {
        try {
            await device.releaseInterface(0); // Release the claimed interface
            await device.close(); // Close the device
            outputDiv.textContent = 'Disconnected.';
            connectButton.style.display = 'initial';
            disconnectButton.style.display = 'none';
        } catch (error) {
            outputDiv.textContent = `Error disconnecting: ${error.message}`;
            console.error(error);
        }
    }
});