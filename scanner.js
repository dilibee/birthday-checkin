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


    const audioContext =
    new (window.AudioContext || window.webkitAudioContext)();


    const oscillator =
    audioContext.createOscillator();


    const gain =
    audioContext.createGain();



    oscillator.connect(gain);

    gain.connect(audioContext.destination);



    if(success){

        oscillator.frequency.value = 880;
        gain.gain.value = 0.3;

    } else {

        oscillator.frequency.value = 220;
        gain.gain.value = 0.3;

    }


    oscillator.start();


    oscillator.stop(
        audioContext.currentTime + 0.25
    );


}






// Start scanner
startScanner();


