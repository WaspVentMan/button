let charIndex = ` 0123456789abcdefghijklmnopqrstuvwxyz.,!?'-+$"~&/#%():[]|{}`

/**
 * Renders a character into a HTML String.
 * 
 * For compatable chars see: [docs](https://github.com/WaspVentMan/Peaks-87/tree/main?tab=readme-ov-file#compatable-characters)
 * @param {string} char 
 * @returns {string} HTML UFO 50 Text, apply to an element's `.innerHTML`
 */
function renderChar(char, font="default"){
    char = char.toLowerCase()
    if (Math.random() < 0.01 && font == "segment" && char != " "){if (Math.random() < 0.5){char = String(Math.round(Math.random()*9))} else {char = charIndex[Math.floor(Math.random()*charIndex.length)]}}
    if (letterIndex(char)[0]){
        return `<div style="width: 8px; height: 16px; background-image: url(img/font/${font}.png); background-position: ${(letterIndex(char)[1]+1)*8}px 0px"></div>`
    }
    if (Math.random() < 0.01){if (Math.random() < 0.5){char = String(Math.round(Math.random()*9))} else {char = charIndex[Math.floor(Math.random()*charIndex.length)]}}
    return `<div style="width: 8px; height: 16px; background-image: url(img/font/${font}.png); background-position: ${(Math.round(Math.random()*1000)*8)+4}px 0px"></div>`
}

/**
 * Renders a string into a HTML String.
 * 
 * For compatable chars see: [docs](https://github.com/WaspVentMan/Peaks-87/tree/main?tab=readme-ov-file#compatable-characters)
 * @param {string} string 
 * @returns {string} HTML UFO 50 Text, apply to an element's `.innerHTML`
 */
function renderString(string, font="default"){
    let newString = `<div style="width: max-content; margin: auto; height: 16px; display: flex; text-align: center">`

    for (let x = 0; x < string.length; x++){
        newString += renderChar(string[x], font=font)
    }

    newString += `</div>`

    return newString
}

/**
 * Renders a list of strings as a HTML String.
 * 
 * For compatable chars see: [docs](https://github.com/WaspVentMan/Peaks-87/tree/main?tab=readme-ov-file#compatable-characters)
 * @param {[string, string]} strings 
 * @returns {string} HTML String, apply to an element's `.innerHTML`
 */
function renderStrings(strings, font="default"){
    let newString = ``

    for (let x = 0; x < strings.length; x++){
        newString += renderString(strings[x], font=font)
    }

    return newString
}

/**
 * Spits out `count` of commas.
 * @param {int} count
 * @returns {string} `count` number of commas
 */
function renderDots(count, char=","){
    let dots = ""
    for (let z = 0; z < count; z++){
        dots += char
    }
    return dots
}

/**
 * Renders a time integer as a HTML String.
 * @param {int} time Time integer in ms
 * @returns {string} HTML String, apply to an element's `.innerHTML`
 */
function renderTime(time) {
    var ms = String(time % 1000)
    time = (time - ms) / 1000
    var secs = String(time % 60)
    time = (time - secs) / 60
    var mins = String(time % 60)
    var hrs = String((time - mins) / 60)

    while (ms.length < 3){
        ms = "0" + ms
    }

    while (secs.length < 2){
        secs = "0" + secs
    }

    while (mins.length < 2){
        mins = "0" + mins
    }
  
    return hrs + ':' + mins + ':' + secs + '.' + ms
}

function letterIndex(char){
    for (let x = 0; x < charIndex.length; x++){
        if (char == charIndex[x]){
            return [true, x]
        }
    }

    return [false, 0]
}