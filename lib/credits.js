let credits = [
    "",
    "- data stream start -",
    "",
    renderDots(64, "_"),
    renderDots(64, "_"),
    renderDots(64, "_"),
    "",
    "BUTTON",
    "BY JACOB A. G. TAYLOR",
    "",
    renderDots(64, "_"),
    renderDots(64, "_"),
    renderDots(64, "_"),
    "",
    "INSPIRED BY",
    "press the button by truefire",
    "animal well by billy basso",
    "",
    renderDots(64, "_"),
    renderDots(64, "_"),
    renderDots(64, "_"),
    "",
    "MUSIC",
    `EIRIK SUHRKE - "VELGRESS - SHOP"`,
    "",
    renderDots(64, "_"),
    renderDots(64, "_"),
    renderDots(64, "_"),
    "",
    "FONT",
    "SFONTTALL FROM UFO 50",
    "SFONTDIGITAL2 FROM UFO 50",
    "",
    renderDots(64, "_"),
    renderDots(64, "_"),
    renderDots(64, "_"),
    "",
    "PLAYTESTERS",
    "Dexter Taylor",
    "Leroy D'Eath",
    "Paul Taylor",
    "SnowyOwl",
    "",
    renderDots(64, "_"),
    renderDots(64, "_"),
    renderDots(64, "_"),
    "",
    "Special thanks",
    "",
    "RetroBurger",
    "for helping me save 8kb on the filesize",
    ""
]

for (let x = 0; x < 128; x++){
    credits.push(renderDots(64, "_"))
}
credits.push("THANK YOU FOR PERPETUATING MY CYCLE")
credits.push("AWAIT THE NEXT VICTIM, TORTURED SPIRIT")
for (let x = 0; x < 128; x++){
    credits.push(renderDots(64, "_"))
}
credits.push("I CAN WAIT FOR AS LONG AS I NEED TO")
for (let x = 0; x < 128; x++){
    credits.push(renderDots(64, "_"))
}
credits.push("")
credits.push("- data stream end -")

document.querySelector(".creditsText").innerHTML = `<div style="height: 512px;"></div>` + renderStrings(credits)

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
        let creditsScroll = creditsText.getBoundingClientRect().height*(((Date.now()-startTime)/1000) / 600)
        creditsText.style.marginTop = "-" + Math.round(creditsScroll) + "px"
    }, 1000/60)
}