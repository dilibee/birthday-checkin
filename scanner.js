const API_URL = "https://script.google.com/macros/s/AKfycbwmM4jyZH-lweodCs8BoGEBa7WQBbES2SDGbJdBfDJgxRIxAUpB4Q-z2cncS2Gpg9bQCg/exec";

let html5QrCode;
let processing = false;


function startScanner() {

    html5QrCode = new Html5Qrcode("reader");


    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 20,
            qrbox: 300
        },

        qrCodeMessage => {

            if (processing) return;

            processing = true;

            checkTicket(qrCodeMessage);

        },

        errorMessage => {
            // Ignore scan errors
        }

    );

}



function checkTicket(ticketID) {


    document.getElementById("status").innerHTML =
    "🔎 Checking ticket...";


    fetch(API_URL + "?id=" + encodeURIComponent(ticketID))

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

        },3000);


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



startScanner();
