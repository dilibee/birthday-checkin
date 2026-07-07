const API_URL = "https://script.google.com/macros/s/AKfycbwmM4jyZH-lweodCs8BoGEBa7WQBbES2SDGbJdBfDJgxRIxAUpB4Q-z2cncS2Gpg9bQCg/exec";


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

            document.getElementById("status").innerHTML =
            "Ready to scan...";

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
        fps: 20,
        qrbox: 300
    }
);


html5QrcodeScanner.render(
    onScanSuccess,
    onScanFailure
);


