const API_URL = "https://script.google.com/macros/s/AKfycbwsvv_sesHg2pWmA6m5hdLZtzy-5Ys2eOTVNDXbxV8tAbMg3wkmGyXwSl5wIK0QCn5RUw/exec";


function onScanSuccess(decodedText) {

    // Stop scanner temporarily
    html5QrcodeScanner.clear();


    document.getElementById("status").innerHTML =
        "Checking ticket...";


    fetch(API_URL + "?id=" + decodedText)
    .then(response => response.json())
    .then(data => {


        if (data.success) {

            document.getElementById("status").innerHTML =
            `
            <div class="approved">
            ✅ APPROVED<br><br>
            ${data.name}<br>
            Guests: ${data.guests}
            </div>
            `;

        } else {

            document.getElementById("status").innerHTML =
            `
            <div class="denied">
            ❌ ${data.message}<br><br>
            ${data.name || ""}
            </div>
            `;

        }


        // Restart scanner after 3 seconds
        setTimeout(() => {

            location.reload();

        },3000);


    })

    .catch(error => {

        document.getElementById("status").innerHTML =
        "Error connecting to database";

        console.log(error);

    });

}


function onScanFailure(error) {

}


let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    {
        fps: 10,
        qrbox: 250
    }
);


html5QrcodeScanner.render(
    onScanSuccess,
    onScanFailure
);


