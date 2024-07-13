function generateQRCodes() {
    generateCodes('qr');
}

function generateBarcodes() {
    generateCodes('barcode');
}

function generateCodes(type) {
    const inputText = document.getElementById('inputText').value;
    const texts = inputText.split(',');
    const codesContainer = document.getElementById('codesContainer');
    codesContainer.innerHTML = ''; // Clear existing codes

    texts.forEach(text => {
        const trimmedText = text.trim();
        if (trimmedText) {
            if (type === 'qr') {
                // Generate QR Code
                const qrCodeDiv = document.createElement('div');
                qrCodeDiv.classList.add('qr-code');
                const qrCode = new QRCode(qrCodeDiv, {
                    text: trimmedText,
                    width: 128,
                    height: 128
                });
                codesContainer.appendChild(qrCodeDiv);
            } else if (type === 'barcode') {
                // Generate Barcode
                const barcodeCanvas = document.createElement('canvas');
                JsBarcode(barcodeCanvas, trimmedText, {
                    format: 'CODE128',
                    lineColor: '#000',
                    width: 2,
                    height: 40,
                    displayValue: true
                });
                barcodeCanvas.classList.add('barcode');
                codesContainer.appendChild(barcodeCanvas);
            }
        } 
    });
}

function printCodes() {

    const printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<style>');
    printWindow.document.write('.qr-code, .barcode { margin: 20px; display: inline-block; }'); // Added margin for spacing
    printWindow.document.write('</style></head><body>');


    // Get all QR codes and barcodes
    const qrCodes = document.querySelectorAll('.qr-code');
    const barcodes = document.querySelectorAll('.barcode');

    // Function to write QR codes to print window
    function writeQRCodes() {
        qrCodes.forEach(qrCode => {
            printWindow.document.write('<html><head><title>Print QR Codes</title>');
            printWindow.document.write('<div class="qr-code">');
            printWindow.document.write(qrCode.innerHTML);
            printWindow.document.write('</div>');
        });
    }

    // Function to convert barcode canvas to image and write to print window
    function writeBarcodes() {
        barcodes.forEach(barcode => {
            const img = new Image();
            img.onload = function() {
                printWindow.document.write('<html><head><title>Print Bar Codes</title>');
                printWindow.document.write('<div class="barcode">');
                printWindow.document.write('<img src="' + img.src + '">');
                printWindow.document.write('</div>');
            };
            img.src = barcode.toDataURL(); // Convert canvas to data URL
        });
    }

    // Write QR codes
    writeQRCodes();

    // Wait for a moment to ensure barcodes are loaded, then write them
    setTimeout(() => {
        writeBarcodes();
        setTimeout(() => {
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }, 500);
    }, 500);
}

function clearCodes() {
    document.getElementById('inputText').value = '';
    document.getElementById('codesContainer').innerHTML = '';
}

// Load QRCode library
const qrScript = document.createElement('script');
qrScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
qrScript.onload = function() {
    // Load JsBarcode library after QRCode library is loaded
    const barcodeScript = document.createElement('script');
    barcodeScript.src = 'https://cdn.jsdelivr.net/npm/jsbarcode/dist/JsBarcode.all.min.js';
    barcodeScript.onload = function() {
        // Enable buttons after both libraries are loaded
        document.getElementById('generateQRCodes').disabled = false;
        document.getElementById('generateBarcodes').disabled = false;
        document.getElementById('printCodes').disabled = false;
        document.getElementById('clearCodes').disabled = false;
    };
    document.head.appendChild(barcodeScript);
};
document.head.appendChild(qrScript);
