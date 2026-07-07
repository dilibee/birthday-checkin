const API_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";

let html5QrCode;
let processing = false;


// Start scanner
function startScanner() {

    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        {
            facingMode: "environment"
        },
        {
            fps: 15,
            qrbox: 280
        },

        (decodedText) => {

            if (processing) return;

            processing = true;

            // Pause camera while checking
            html5QrCode.pause();

            checkTicket(decodedText);

        },

        () => {
            // Ignore normal scan failures
        }

    )
    .catch(err => {

        console.log(err);

        document.getElementById("status").innerHTML =
        "Camera failed";

    });

}



// Check database
function checkTicket(ticketID) {


    document.getElementById("status").innerHTML =
    "🔎 Checking ticket...";


    fetch(API_URL + "?id=" + encodeURIComponent(ticketID))

    .then(response => response.json())

    .then(data => {


        if(data.success){


            showResult(
                true,
                "✅ APPROVED",
                data.name,
                "Guests: " + data.guests
            );


            vibrate([200]);


        } else {


            showResult(
                false,
                "❌ DENIED",
                data.message,
                data.name || ""
            );


            vibrate([200,100,200]);

        }



        setTimeout(()=>{


            hideResult();


            document.getElementById("status").innerHTML =
            "Ready to scan...";


            processing = false;


            // Resume camera
            html5QrCode.resume();


        },2500);



    })


    .catch(error=>{


        console.log(error);


        showResult(
            false,
            "❌ ERROR",
            "Connection failed",
            ""
        );


        setTimeout(()=>{

            hideResult();

            processing=false;

            html5QrCode.resume();


        },2500);


    });


}




function showResult(success,title,name,guests){


    let overlay =
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


}



function hideResult(){

    document.getElementById("resultOverlay").className="";

}




function vibrate(pattern){

    if(navigator.vibrate){

        navigator.vibrate(pattern);

    }

}



// Faster reliable sound
function playSound(success){


    let ctx =
    new (window.AudioContext || window.webkitAudioContext)();


    let osc =
    ctx.createOscillator();


    let gain =
    ctx.createGain();


    osc.connect(gain);

    gain.connect(ctx.destination);



    osc.frequency.value =
    success ? 880 : 220;


    gain.gain.value = 0.15;


    osc.start();


    osc.stop(
        ctx.currentTime + 0.15
    );

}



startScanner();


