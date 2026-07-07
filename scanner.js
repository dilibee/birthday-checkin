function onScanSuccess(decodedText) {

    document.getElementById("status").innerHTML =
        "QR Found:<br>" + decodedText;

}


function onScanFailure(error) {

}


let scanner = new Html5QrcodeScanner(
    "reader",
    {
        fps: 10,
        qrbox: 250
    }
);


scanner.render(
    onScanSuccess,
    onScanFailure
);


