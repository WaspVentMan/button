let player = ""

let saveData = localStorage.getItem("BUTTON")
if (saveData != null){
    player = JSON.parse(saveData)
    player.pos = [252, 1024]
    player.vel = [0, 0]
    player.fear = false
} else {
    player = {
        "pos": [252, 1024],
        "vel": [0, 0],
        "count": 0,
        "countDisp": 0,
        "countDispTick": false,
        "stun": 0,
        "combo": 0,
        "power": 1,
        "clone": [],
        "fear": false,
        "control": {
            "jump": false,
            "move": false
        },
        "intro": 1,
        "shop": {
            "cursor": 0
        },
        "button": {
            "depth": 0,
            "vel": 0
        },
        "upgrades": {
            "mat": {"unlocked": false, "active": true},
            "carpet": {"unlocked": false, "active": true},
            "airControl": {"unlocked": false, "active": true},
            "combo": {"unlocked": false, "active": true},
            "woke": {"unlocked": false, "active": false}
        }
    }
}

let stuckcounter = 0
let startTime = Date.now()
let music = [new Audio("sfx/shop.mp3"), new Audio("sfx/fear.mp3")]
music[0].loop = true
music[1].loop = true
music[0].volume = 0
music[1].volume = 0

let lastblink = Date.now()

let sounds = []
function sfx(sound, vol = 100){
    if (mobile){return}
    try {
        let a = new Audio(sound)
        a.play()
        a.volume = vol/100
        sounds.push(a)
    
        if (sounds.length > 32){
            sounds[0].pause()
            sounds.splice(0, 1)
        }
    } catch {
        console.log("lol")
    }
    
}

function buttonColl(y){
    if (player.vel[1] < -2){
        sfx("sfx/land.mp3", 25)
        player.control.jump = false
        player.control.move = false
        player.button.vel = -(player.vel[1]*1.1)
    }

    player.vel[1] = 0
    player.pos[1] = y-player.button.depth

    if (player.control.jump && key.z && player.button.depth == 0 && player.vel[1] == 0){
        player.vel[1] = 8
        sfx("sfx/jump.mp3", 10)
    }

    if (player.control.move && key.ArrowLeft && player.stun < Date.now()){
        player.vel[0] = -60
    } else if (player.control.move && key.ArrowRight && player.stun < Date.now()){
        player.vel[0] = 60
    } else if (!player.upgrades.woke.active){
        player.vel[0] = 0
    }
}

function renderItems(){
    if (player.upgrades.woke.unlocked){
        document.querySelector(".woke").style.display = 'block'
    } else {
        document.querySelector(".woke").style.display = 'none'
    }

    if (player.upgrades.combo.unlocked){
        document.querySelector(".comboItem").style.display = 'block'
    } else {
        document.querySelector(".comboItem").style.display = 'none'
    }

    if (player.upgrades.carpet.unlocked){
        document.querySelector(".carpet").style.display = 'block'
    } else {
        document.querySelector(".carpet").style.display = 'none'
    }

    if (player.upgrades.mat.unlocked){
        document.querySelector(".mat").style.display = 'block'
    } else {
        document.querySelector(".mat").style.display = 'none'
    }
}

function interactPrompt(){
    if (player.pos[0] >= 128 && player.pos[0] <= 136){
        document.querySelector(".IE").style.display = 'block'
        document.querySelector(".IE").style.left = "132px"
        document.querySelector(".IE").style.bottom = "96px"
    } else {
        document.querySelector(".IE").style.display = 'none'
    }
}

document.querySelector(".shopCont").innerHTML = renderStrings(["z to buy   x to leave", "left and right to change items"])
renderItems()

let tick = Date.now()
setInterval(function(){
    let d = (Date.now() - tick) / 1000
    tick = Date.now()

    if (player.fear){document.querySelector(".counter").innerHTML = renderString("error   ", font="segment")}
    if (player.fear && player.upgrades.combo.active){document.querySelector(".combo").innerHTML = renderString("error   ", font="segment")}

    if (document.querySelector(".focus").style.display == 'block'){return}
    if (document.querySelector(".loadZoneDeluxe").style.display == 'block'){return}
    if (document.querySelector(".credits").style.display == "block"){return}

    if (player.fear){
        music[0].volume = 0
        music[1].volume = 0.2
    } else if (player.pos[0] > 96 && player.pos[0] < 168){
        music[1].volume = 0
        music[0].volume = 0.05
    } else {
        music[1].volume = 0
        music[0].volume = 0
    }

    if (player.countDisp == player.count || player.fear){
        player.countDispTick = false
    } else if (player.countDispTick){
        if (player.countDisp < player.count){
            player.countDisp += Math.ceil((10**String(player.count-player.countDisp).length)/10)
        } else {
            player.countDisp -= Math.ceil((10**String(player.countDisp-player.count).length)/10)
        }

        if (player.countDisp > 99999999){
            player.fear = true
            if (!offline){
                NGIO.postScore(14484, 1, function(){})
                NGIO.postScore(14485, Date.now()-startTime, function(){})
            }
            unlockMedal(82727)
            document.querySelector(".shopEyes").style.display = "none"
            document.querySelector(".shopBubble").style.display = "none"
            document.querySelector(".shopText").innerHTML = renderStrings(["the shopkeeper is gone.", "", "there is a note on the door.", "", "\"thank you... and sorry\"", "", "something feels very wrong..."])
            music[1].currentTime = 0
            music[1].volume = 0.2
            music[0].volume = 0

            localStorage.removeItem("BUTTON")
        }
        
        sfx("sfx/ting.mp3", 5)
    }

    if (document.querySelector(".shop").style.display == 'block'){
        if (key.x && !held.x){
            held.x = true
            if (player.fear && document.querySelector(".player").style.display == "none"){
                playCredits()
                player.pos = [0, 0]
            } else if (player.fear){
                document.querySelector(".player").style.display = "none"
                player.control.jump = false
                player.control.move = false
            }
            document.querySelector(".shop").style.display = 'none'
        }

        if (key.z && !held.z){
            held.z = true
            if (player.fear){
                sfx("sfx/nope.mp3", 50)
            } else if (player.count >= Math.floor(((player.power**2)**1.1)/(player.upgrades.mat.unlocked+1)) && player.shop.cursor == 0){
                player.count -= Math.floor(((player.power**2)**1.1)/(player.upgrades.mat.unlocked+1))
                player.power = Math.ceil(player.power*1.1)
                sfx("sfx/yeah.mp3", 50)
                setTimeout(function(){player.countDispTick = true}, 100)
                if (player.count >= player.power*10){
                    setTimeout(function(){held.z = false}, 100)
                }
            } else if (player.count >= 50 && player.shop.cursor == 1 && !player.upgrades.combo.unlocked){
                player.count -= 50
                player.upgrades.combo.unlocked = true
                sfx("sfx/yeah.mp3", 50)
                setTimeout(function(){player.countDispTick = true}, 100)
            } else if (player.count >= 500 && player.shop.cursor == 2 && !player.upgrades.airControl.unlocked){
                player.count -= 500
                player.upgrades.airControl.unlocked = true
                sfx("sfx/yeah.mp3", 50)
                setTimeout(function(){player.countDispTick = true}, 100)
            } else if (player.count >= 10000 && player.shop.cursor == 3 && !player.upgrades.carpet.unlocked){
                player.count -= 10000
                player.upgrades.carpet.unlocked = true
                sfx("sfx/yeah.mp3", 50)
                setTimeout(function(){player.countDispTick = true}, 100)
            } else if (player.count >= 49999 && player.shop.cursor == 4 && !player.upgrades.mat.unlocked){
                player.count -= 49999
                player.upgrades.mat.unlocked = true
                sfx("sfx/yeah.mp3", 50)
                setTimeout(function(){player.countDispTick = true}, 100)
            } else {
                sfx("sfx/nope.mp3", 50)
            }
        }

        if (key.ArrowLeft && !held.ArrowLeft && player.shop.cursor > 0){
            held.ArrowLeft = true
            player.shop.cursor--
            sfx("sfx/click.mp3", 50)
        } else if (key.ArrowRight && !held.ArrowRight && player.shop.cursor < 4){
            held.ArrowRight = true
            player.shop.cursor++
            sfx("sfx/click.mp3", 50)
        } else if ((key.ArrowRight && !held.ArrowRight) || (key.ArrowLeft && !held.ArrowLeft)){
            held.ArrowLeft  = key.ArrowLeft
            held.ArrowRight = key.ArrowRight
            sfx("sfx/nope.mp3", 50)
        }

        if (!player.fear){
            switch(player.shop.cursor){
                case 0:
                    document.querySelector(".shopImg").style.backgroundImage = "url(img/shop/upgrade/power.png)"
                    if (player.power == 1){
                        document.querySelector(".shopText").innerHTML = renderStrings(["", "the shopkeep said that they", "can tweak the button power from", "behind the door.", "", "i hope they aren't lying."])
                    } else {
                        document.querySelector(".shopText").innerHTML = renderStrings(["", "the shopkeep said that they", "can tweak the button power from", "behind the door.", "", "they weren't lying, they really", "can increase the power."])
                    }
                    document.querySelector(".shopTalk").innerHTML = renderStrings(["power upgrade", "fer " + Math.floor(((player.power**2)**1.1)/(player.upgrades.mat.unlocked+1))])
                    break
                case 1:
                    document.querySelector(".shopImg").style.backgroundImage = "url(img/shop/upgrade/combo.png)"
                    document.querySelector(".shopText").innerHTML = renderStrings(["", "it's a jumbed mess of", "cables and machinery", "that looks like it can be", "attached to the counter.", "", "some of the machinery looks", "suspiciously organic", "maybe something down here", "likes making sick and", "twisted machines?"])
                    if (!player.upgrades.combo.unlocked){
                        document.querySelector(".shopTalk").innerHTML = renderStrings(["combo meter", "fer 50"])
                    } else {
                        document.querySelector(".shopTalk").innerHTML = renderStrings(["yer already", "bought me", "combo meter"])
                    }
                    break
                case 2:
                    document.querySelector(".shopImg").style.backgroundImage = "url(img/shop/upgrade/air.png)"
                    document.querySelector(".shopText").innerHTML = renderStrings(["", "neither me nor the", "shopkeep knows how it works", "", "but it does work... right?"])
                    if (!player.upgrades.airControl.unlocked){
                        document.querySelector(".shopTalk").innerHTML = renderStrings(["air control", "fer 500"])
                    } else {
                        document.querySelector(".shopTalk").innerHTML = renderStrings(["yer already", "bought", "air control"])
                    }
                    break
                case 3:
                    document.querySelector(".shopImg").style.backgroundImage = "url(img/shop/upgrade/woke.png)"
                    document.querySelector(".shopText").innerHTML = renderStrings(["", "a pair of old fancy carpets.", "", "they look like they'll", "stop me bouncing about", "when i land.", "", "i think i had one", "like this at home."])
                    if (!player.upgrades.carpet.unlocked){
                        document.querySelector(".shopTalk").innerHTML = renderStrings(["carpet", "fer 10000"])
                    } else {
                        document.querySelector(".shopTalk").innerHTML = renderStrings(["yer already", "bought me", "carpet"])
                    }
                    break
                case 4:
                    document.querySelector(".shopImg").style.backgroundImage = "url(img/shop/upgrade/woke.png)"
                    document.querySelector(".shopText").innerHTML = renderStrings(["", "an old welcome mat.", "", "the shopkeep said that they'll", "give half price power upgrades", "if i buy this...", "", "does the counter even have", "any monetary value?"])
                    if (!player.upgrades.mat.unlocked){
                        document.querySelector(".shopTalk").innerHTML = renderStrings(["welcome mat", "fer 49999"])
                    } else {
                        document.querySelector(".shopTalk").innerHTML = renderStrings(["yer already", "bought me", "welcome mat"])
                    }
                    break
            }
        }

        if (player.fear && document.querySelector(".player").style.display != "none"){
            document.querySelector(".note").style.display = "block"
            document.querySelector(".shopEyes").style.display = "none"
        } else if (player.fear){
            document.querySelector(".shopText").innerHTML = renderStrings(["it's you"])
            document.querySelector(".shopEyes").style.display = "block"
            document.querySelector(".leftEye").style.backgroundImage = "url(img/shop/yourEyes.png)"
            document.querySelector(".rightEye").style.backgroundImage = "url(img/shop/yourEyes.png)"
            unlockMedal(82728)
            if (lastblink < Date.now()-(1000+(320000*Math.random()))){
                document.querySelector(".leftEye").style.backgroundPosition = "0px 192px"
                document.querySelector(".leftEye").style.transform = "scaleX(1)"
                document.querySelector(".rightEye").style.backgroundPosition = "0px 192px"
                document.querySelector(".rightEye").style.transform = "scaleX(-1)"
                lastblink = Date.now()
            } else if (lastblink < Date.now()-100) {
                let look = Math.round(Math.sin(Date.now()/10000)/1.9)
                if (look == -1){
                    document.querySelector(".leftEye").style.backgroundPosition = "0px 128px"
                    document.querySelector(".leftEye").style.transform = "scaleX(1)"
                    document.querySelector(".rightEye").style.backgroundPosition = "0px 64px"
                    document.querySelector(".rightEye").style.transform = "scaleX(1)"
                } else if (look == 1){
                    document.querySelector(".leftEye").style.backgroundPosition = "0px 64px"
                    document.querySelector(".leftEye").style.transform = "scaleX(-1)"
                    document.querySelector(".rightEye").style.backgroundPosition = "0px 128px"
                    document.querySelector(".rightEye").style.transform = "scaleX(-1)"
                } else {
                    document.querySelector(".leftEye").style.backgroundPosition = "0px 256px"
                    document.querySelector(".leftEye").style.transform = "scaleX(1)"
                    document.querySelector(".rightEye").style.backgroundPosition = "0px 256px"
                    document.querySelector(".rightEye").style.transform = "scaleX(-1)"
                }
    
                document.querySelector(".shopEyes").style.top = Math.round(128 + Math.sin(Date.now()/1000)) + "px"
                document.querySelector(".shopEyes").style.left = Math.round(64 + Math.sin(Date.now()/10000)) + "px"
            }
        } else if (lastblink < Date.now()-(1000+(320000*Math.random()))){
            document.querySelector(".leftEye").style.backgroundPosition = "0px 192px"
            document.querySelector(".leftEye").style.transform = "scaleX(1)"
            document.querySelector(".rightEye").style.backgroundPosition = "0px 192px"
            document.querySelector(".rightEye").style.transform = "scaleX(-1)"
            lastblink = Date.now()
        } else if (lastblink < Date.now()-100) {
            let look = Math.round(Math.sin(Date.now()/10000)/1.9)
            if (look == -1){
                document.querySelector(".leftEye").style.backgroundPosition = "0px 128px"
                document.querySelector(".leftEye").style.transform = "scaleX(1)"
                document.querySelector(".rightEye").style.backgroundPosition = "0px 64px"
                document.querySelector(".rightEye").style.transform = "scaleX(1)"
            } else if (look == 1){
                document.querySelector(".leftEye").style.backgroundPosition = "0px 64px"
                document.querySelector(".leftEye").style.transform = "scaleX(-1)"
                document.querySelector(".rightEye").style.backgroundPosition = "0px 128px"
                document.querySelector(".rightEye").style.transform = "scaleX(-1)"
            } else {
                document.querySelector(".leftEye").style.backgroundPosition = "0px 256px"
                document.querySelector(".leftEye").style.transform = "scaleX(1)"
                document.querySelector(".rightEye").style.backgroundPosition = "0px 256px"
                document.querySelector(".rightEye").style.transform = "scaleX(-1)"
            }

            document.querySelector(".shopEyes").style.top = Math.round(128 + Math.sin(Date.now()/1000)) + "px"
            document.querySelector(".shopEyes").style.left = Math.round(64 + Math.sin(Date.now()/10000)) + "px"
        }

        return
    } else if (key.x && !held.x && player.pos[0] >= 128 && player.pos[0] <= 136 && player.pos[1] == 64){
        held.x = true
        document.querySelector(".shop").style.display = 'block'
        lastblink = Date.now()
    } else if (key.x && !held.x && player.pos[0] > 216 && player.pos[0] < 288 && player.upgrades.combo.unlocked){
        held.x = true
        player.upgrades.combo.active = !player.upgrades.combo.active
        sfx("sfx/slam.mp3", 10)
    }

    if (player.upgrades.woke.active){
        if (key.x && !held.x){
            player.upgrades.woke.active = false
            player.control.move = true
            player.control.jump = true
            held.x = true
        } else {
            player.control.move = false
            player.control.jump = false
    
            if (player.pos[0] > 240 && player.pos[0] < 256 && player.pos[1] <= 96 && player.vel[0] != 0){
                player.vel[0] = 0
                player.vel[1] = 8
                sfx("sfx/jump.mp3", 10)
            } else if (player.pos[0] < 248 && (player.pos[1] == 64 || (player.vel[1] == 0 && player.pos[1] >= 91 && player.pos[1] <= 96 && player.pos[0] > 216 && player.pos[0] < 288))){
                player.vel[0] = 60
                if (player.pos[0] > 200 && player.pos[1] == 64){
                    player.vel[1] = 8
                    sfx("sfx/jump.mp3", 10)
                }
            } else if (player.pos[0] > 248 && (player.pos[1] == 64 || (player.vel[1] == 0 && player.pos[1] >= 91 && player.pos[1] <= 96 && player.pos[0] > 216 && player.pos[0] < 288))){
                player.vel[0] = -60
                if (player.pos[0] < 304 && player.pos[1] == 64){
                    player.vel[1] = 8
                    sfx("sfx/jump.mp3", 10)
                }
            }
        }
    } else if (key.x && !held.x && player.pos[0] > 416 && player.pos[0] < 424 && player.pos[1] == 64 && player.upgrades.woke.unlocked){
        held.x = true
        player.upgrades.woke.active = true
    }

    player.button.depth += player.button.vel*d*15
    if (player.button.depth < 0){
        player.control.jump = true
        player.control.move = true

        if (player.button.vel < -5){
            player.pos[1] = 96
            player.vel[0] += (180*Math.random())-90
            player.vel[1] = 10

            if (player.upgrades.carpet.unlocked){
                player.intro = false
            } else {
                player.intro = 2
            }
        }

        player.button.depth = 0
        player.button.vel = 0
    } else if (player.button.depth > 7){
        player.button.depth = 7
        player.button.vel = -player.button.vel

        let damage = Math.floor(player.power*(((player.combo**1.1)/5)+1))
        player.count += damage

        sfx("sfx/click.mp3", 50)
        if (player.upgrades.combo.unlocked && player.upgrades.combo.active){
            player.combo++
            if (player.combo >= 99){
                player.combo = 99
                unlockMedal(82757)
            }
        }

        setTimeout(function(){player.countDispTick = true}, 500)
    } else if (player.button.depth != 0){
        player.button.vel -= 1
    }

    player.pos[1] += player.vel[1]*d*30
    
    if (player.pos[0] > 216 && player.pos[0] < 288 && player.pos[1] < 100 && player.intro != false && player.vel[0] == 0 && player.vel[1] > -1 && player.vel[1] < 0 && player.button.vel == 0){
        player.intro = false
        player.control.move = true
        player.control.jump = true
    } else if (player.pos[1] < 96 && player.pos[0] > 234 && player.pos[0] < 269){
        buttonColl(96, false)
    } else if (player.pos[1] < 95 && player.pos[0] > 226 && player.pos[0] < 277){
        buttonColl(95, false)
    } else if (player.pos[1] < 94 && player.pos[0] > 221 && player.pos[0] < 283){
        buttonColl(94, false)
    } else if (player.pos[1] < 93 && player.pos[0] > 218 && player.pos[0] < 286){
        buttonColl(93, false)
    } else if (player.pos[1] < 92 && player.pos[0] > 217 && player.pos[0] < 287){
        buttonColl(92, false)
    } else if (player.pos[1] < 91 && player.pos[0] > 216 && player.pos[0] < 288){
        buttonColl(91, false)
    } else if (player.pos[1] < 64){
        player.combo = 0
        player.pos[1] = 64

        if (player.intro != false){
            sfx("sfx/land.mp3", 25)
            player.control.move = false
            player.control.jump = false
            switch (player.intro){
                case 1:
                    player.intro = false
                    player.control.move = true
                    player.control.jump = true
                    break
                case 2:
                    player.intro = 3
                    player.vel[0] /= 1.5
                    player.vel[1] = 6
                    break
                case 3:
                    player.vel[0] /= 2
                    player.vel[1] = 3
                    player.intro = false
                    player.control.move = true
                    player.control.jump = true
                    break
            }
        } else {
            if (player.vel[1] < -1){
                sfx("sfx/land.mp3", 25)
                player.vel[0] = 0
            }
            player.vel[1] = 0

            if (player.control.jump && key.z){
                player.vel[1] = 8
                sfx("sfx/jump.mp3", 10)
            }

            if (player.control.move && key.ArrowLeft && player.stun < Date.now()){
                player.vel[0] = -60
            } else if (player.control.move && key.ArrowRight && player.stun < Date.now()){
                player.vel[0] = 60
            } else if (!player.upgrades.woke.active && player.intro == false){
                player.vel[0] = 0
            }

            if (player.pos[1] < 91-player.button.depth && player.pos[0] + (player.vel[0]*d) > 216 && player.pos[0] <= 256){
                player.vel[0] = 10
                player.pos[0] = 216 - player.vel[0]*d
            } else if (player.pos[1] < 91-player.button.depth && player.pos[0] > 256 && player.pos[0] + (player.vel[0]*d) < 288){
                player.vel[0] = -10
                player.pos[0] = 288 - player.vel[0]*d
            } else if (player.pos[0] + (player.vel[0]*d) < 64){
                player.vel[0] = -10
                player.pos[0] = 64 - player.vel[0]*d
            } else if (player.pos[0] + (player.vel[0]*d) > 440){
                player.vel[0] = 10
                player.pos[0] = 440 - player.vel[0]*d
            }
        }
    } else if (player.pos[1] < 91-player.button.depth && player.pos[0] + (player.vel[0]*d) > 216 && player.pos[0] <= 256){
        player.vel[0] = 10
        player.pos[0] = 216 - player.vel[0]*d
    } else if (player.pos[1] < 91-player.button.depth && player.pos[0] > 256 && player.pos[0] + (player.vel[0]*d) < 288){
        player.vel[0] = -10
        player.pos[0] = 288 - player.vel[0]*d
    } else if (player.pos[0] + (player.vel[0]*d) < 64){
        player.vel[0] = -10
        player.pos[0] = 64 - player.vel[0]*d
    } else if (player.pos[0] + (player.vel[0]*d) > 440){
        player.vel[0] = 10
        player.pos[0] = 440 - player.vel[0]*d
    } else if (player.upgrades.airControl.unlocked && player.upgrades.airControl.active){
        if (key.ArrowLeft && player.control.move && player.stun < Date.now()){
            if (player.vel[0] > -60){
                player.vel[0] -= 200*d
            }
        } else if (key.ArrowRight && player.control.move && player.stun < Date.now()){
            if (player.vel[0] < 60){
                player.vel[0] += 200*d
            }
        }
    }
    
    player.pos[0] += player.vel[0]*d
    player.pos[1] += player.vel[1]*d
    player.vel[1] -= 0.5*d*60

    // render
    document.querySelector(".player").style.left = Math.round(player.pos[0]) + "px"
    document.querySelector(".player").style.bottom = Math.round(player.pos[1]) + "px"

    if (player.vel[0] < 0){
        document.querySelector(".player").style.transform = "scaleX(-1)"
    } else if (player.vel[0] > 0){
        document.querySelector(".player").style.transform = "scaleX(1)"
    }

    document.querySelector(".button").style.top = Math.round(player.button.depth) + "px"

    if (document.querySelector(".theDoor").style.backgroundPosition == "32px 128px" && player.pos[0] > 96 && player.pos[0] < 168){
        sfx("sfx/open.mp3", 10)
    }

    if (player.fear && document.querySelector(".player").style.display == "none"){
        document.querySelector(".theDoor").style.backgroundPosition = "48px 128px"
    } else if (player.fear){
        if (document.querySelector(".theDoor").style.backgroundPosition != "48px 112px"){
            sfx("sfx/open.mp3", 10)
        }
        document.querySelector(".theDoor").style.backgroundPosition = "48px 112px"
    } else if (player.pos[0] > 96 && player.pos[0] < 128){
        document.querySelector(".theDoor").style.transform = "scaleX(-1)"
        document.querySelector(".theDoor").style.backgroundPosition = "16px 128px"
    } else if (player.pos[0] >= 128 && player.pos[0] <= 136){
        document.querySelector(".theDoor").style.backgroundPosition = "16px 112px"
    } else if (player.pos[0] > 136 && player.pos[0] < 168){
        document.querySelector(".theDoor").style.transform = "scaleX(1)"
        document.querySelector(".theDoor").style.backgroundPosition = "16px 128px"
    } else if (document.querySelector(".theDoor").style.backgroundPosition != "32px 128px"){
        sfx("sfx/slam.mp3", 10)
        document.querySelector(".theDoor").style.backgroundPosition = "32px 128px"
    }

    if (player.fear && player.upgrades.combo.active){
        document.querySelector(".combo").innerHTML = renderString("error   ", font="segment")
    } else if (player.upgrades.combo.active){
        document.querySelector(".combo").innerHTML = renderString(Math.round(player.combo) + renderDots(3-String(Math.round(player.combo)).length).replaceAll(",", " ") + "combo", font="segment")
    } else {
        document.querySelector(".combo").innerHTML = renderString(renderDots(8).replaceAll(",", " "), font="segment")
    }
    
    if (!player.upgrades.combo.unlocked){
        document.querySelector(".combo").style.display = "none"
    } else {
        document.querySelector(".combo").style.display = "block"
    }

    if (player.fear){
        document.querySelector(".counter").innerHTML = renderString("error   ", font="segment")
    } else if (player.countDisp == 0){
        document.querySelector(".counter").innerHTML = renderString(renderDots(8).replaceAll(",", " "), font="segment")
    } else {
        document.querySelector(".counter").innerHTML = renderString(renderDots(8-String(Math.round(player.countDisp)).length).replaceAll(",", " ") + Math.round(player.countDisp), font="segment")
    }

    interactPrompt()
    renderItems()

    if (!player.fear){
        localStorage.setItem("BUTTON", JSON.stringify(player))
    }

    if (!document.hasFocus() && !mobile){
        document.querySelector(".focus").style.display = 'block'
        music[0].pause()
        music[1].pause()
    }
}, 1000/60)

console.info("Please don't cheat the medals, I worked hard on this game.\nThat means you too, fuckoffasshole.")