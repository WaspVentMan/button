let credits = [
    "",
    "BY_JACOB_A,_G,_TAYLOR",
    "",
    "INSPIRED_BY",
    "press_the_button_by_truefire",
    "",
    "MUSIC",
    "EIRIK_SUHRKE_-_+VELGRESS_-_SHOP+",
    "",
    "FONT",
    "SFONTTALL_FROM_UFO_50",
    "SFONTDIGITAL2_FROM_UFO_50",
    "",
    "PLAYTESTERS",
    "",
    "NorfolkRail",
    "SnowyOwl",
    "",
    "Special_thanks",
    "",
    "RetroBurger",
    "for_helping_me_save_8kb_on_the_filesize",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "THANK_YOU_FOR_PERPETUATING_THE_CYCLE",
    "AWAIT_THE_NEXT,_TORTURED_SPIRIT"
]

document.querySelector(".creditsText").innerHTML += `<div style="height: 512px;"></div><div style="background-image: url(img/logo.png); width: 128px; height: 64px; margin: auto"></div>` + renderStrings(credits)

/**
 * Plays the credits onscreen
 * @param {boolean} title Show the title screen after ending?
 * @param {boolean} board Show the leaderboard after ending?
 */
function playCredits(){
    let startTime = Date.now()
    let creditsText = document.querySelector(".creditsText")

    document.querySelector(".credits").style.display = "block"

    setInterval(function(){
        let creditsScroll = creditsText.getBoundingClientRect().height*(((Date.now()-startTime)/1000) / 60)
        creditsText.style.marginTop = "-" + Math.round(creditsScroll) + "px"
    }, 0)
}