const API_URL = "https://script.google.com/macros/s/AKfycbwmM4jyZH-lweodCs8BoGEBa7WQBbES2SDGbJdBfDJgxRIxAUpB4Q-z2cncS2Gpg9bQCg/exec";

let processing = false;


function onScanSuccess(decodedText) {

    // Prevent multiple scans at once
    if (processing) return;

    processing = true;


    document.getElementById("status").innerHTML =
    `
    <div>
    🔎 Checking ticket...
    </div>
    `;


    fetch(API_URL + "?id=" + encodeURIComponent(decodedText))
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


        setTimeout(() => {

            document.getElementById("status").innerHTML =
            "Ready to scan...";

            processing = false;

        }, 3000);


    })


    .catch(error => {

        console.log(error);


        document.getElementById("status").innerHTML =
        `
        <div class="denied">
        ❌ Error connecting to database
        </div>
        `;


        setTimeout(() => {

            document.getElementById("status").innerHTML =
            "Ready to scan...";

            processing = false;

        },3000);


    });

}



function onScanFailure(error) {

    // Ignore failed scans
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
