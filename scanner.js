const API_URL = "https://script.google.com/macros/s/AKfycbwmM4jyZH-lweodCs8BoGEBa7WQBbES2SDGbJdBfDJgxRIxAUpB4Q-z2cncS2Gpg9bQCg/exec";

let html5QrCode;
let processing = false;


// Start camera scanner
function startScanner() {

    html5QrCode = new Html5Qrcode("reader");


    html5QrCode.start(
        {
            facingMode: "environment"
        },
        {
            fps: 20,
            qrbox: 300
        },

        (decodedText) => {

            if (processing) return;

            processing = true;

            checkTicket(decodedText);

        },

        (errorMessage) => {
            // Ignore normal scanning errors
        }

    )
    .catch(err => {

        document.getElementById("status").innerHTML =
        "Camera error: " + err;

    });

}



// Check guest database
function checkTicket(ticketID) {


    document.getElementById("status").innerHTML =
    "🔎 Checking ticket...";


    fetch(API_URL + "?id=" + encodeURIComponent(ticketID))

    .then(response => response.json())

    .then(data => {


        if (data.success) {


            showResult(
                true,
                "✅ APPROVED",
                data.name,
                "Guests: " + data.guests
            );


            if (navigator.vibrate) {
                navigator.vibrate(200);
            }


        } else {


            showResult(
                false,
                "❌ DENIED",
                data.message,
                data.name || ""
            );


            if (navigator.vibrate) {
                navigator.vibrate([200,100,200]);
            }


        }



        setTimeout(() => {


            document.getElementById("status").innerHTML =
            "Ready to scan...";


            processing = false;


        },3000);



    })


    .catch(error => {


        console.log(error);


        showResult(
            false,
            "❌ ERROR",
            "Database connection failed",
            ""
        );


        processing = false;


    });

}




// Full screen result
function showResult(success, title, name, guests) {


    const overlay =
    document.getElementById("resultOverlay");


    overlay.className =
    success ? "approvedScreen" : "deniedScreen";


    document.getElementById("resultTitle").innerHTML =
    title;


    document.getElementById("resultName").innerHTML =
    name;


    document.getElementById("resultGuests").innerHTML =
    guests;


    playSound(success);



    setTimeout(() => {

        overlay.className = "";

    },3000);


}




// Sounds
function playSound(success) {


    let sound;


    if (success) {

        sound =
        "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg";

    } else {

        sound =
        "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

    }


    let audio = new Audio(sound);

    audio.play();

}



// Start scanner
startScanner();


