let offline = true

// Set up the options for NGIO.
var options = {
    version: "1.0.0",
    preloadScoreBoards: true,
    preloadMedals: true,
    preloadSaveSlots: true
};

NGIO.init("59634:MfeYkipZ", "SHDx88VrkvCD2jz8aSlifw==", options);

let ngLoop = setInterval(function(){
    NGIO.getConnectionStatus(function(status) {
        
        switch (status) {

            // we have version and license info
            case NGIO.STATUS_LOCAL_VERSION_CHECKED:

                let heightText = ""
                if (NGIO.isDeprecated) {
                    for (let x = 0; x < ("v" + options.version + " old").length; x++){
                        heightText += `<div style="width: 8px; height: 16px; background-image: url(img/letter/${("v" + options.version.replaceAll(".", ",") + "_old")[x]}.png);"></div>`
                    }
                } else {
                    for (let x = 0; x < ("v" + options.version).length; x++){
                        heightText += `<div style="width: 8px; height: 16px; background-image: url(img/letter/${("v" + options.version.replaceAll(".", ","))[x]}.png);"></div>`
                    }
                }
                //document.querySelector(".ver").innerHTML = heightText.toLocaleLowerCase()

                if (!NGIO.legalHost) {
                    document.body.innerHTML = "<h1>THIS GAME IS BEING HOSTED ILLEGALLY, GO TO <a href=\"https://waspventman.co.uk\">WASPVENTMAN.CO.UK</a> OR <a href=\"https://waspventman.newgrounds.com/\">WASPVENTMAN.NEWGROUNDS.COM</a></h1>"
                }

                break

            // user needs to log in
            case NGIO.STATUS_LOGIN_REQUIRED: break

            // We are waiting for the user to log in
            case NGIO.STATUS_WAITING_FOR_USER: break

            // user needs to log in
            case NGIO.STATUS_READY:
                offline = false
                break
        }

    })
}, 100)

function unlockMedal(medal, condition = true){
    if (!offline){
        if (!NGIO.getMedal(medal).unlocked && condition){
            NGIO.unlockMedal(medal, onMedalUnlocked)
        }
    }
}

function onMedalUnlocked(medal){}