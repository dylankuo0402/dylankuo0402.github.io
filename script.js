const blocksArea = document.querySelector("#blocksarea");
const allBlocks = document.querySelectorAll(".block");


var blocksdata = []
var blocksarr1 = []
var blocksarr2 = []


var soundsetdata = [
    { name: "correct", sets: [1, 3, 5, 8] },
    { name: "wrong", sets: [2, 4, 5.5, 7] }
]



var icondata = [
    " bi bi-apple",
    " bi bi-balloon-heart-fill",
    " bi bi-bell-fill",
    " bi bi-bell-slash-fill",
    " bi bi-bluetooth",
    " bi bi-boombox-fill",
    " bi bi-briefcase-fill",
    " bi bi-brightness-high-fill",
    " bi bi-broadcast-pin",
    " i bi-camera",
    " bi bi-camera-reels",
    " bi bi-cart",
    " bi bi-cloud-drizzle-fill",
    " bi bi-cloud-sun",
    " bi bi-coin",
    " bi bi-compass",
    " bi bi-cone-striped",
    " bi bi-controller",
    " bi bi-dice-1",
    " bi bi-dice-2",
    " bi bi-dice-3",
    " bi bi-dice-4",
    " bi bi-dice-5",
    " bi bi-dice-6"


]

// var soundsetdata = {
//     correct: {
//         pitch: [3, 4, 5, 6, 7, 8]
//     },
//     wrong: {
//         pitch: [5.5, 8.5, 9.5]
//     }
// }

class Blocks {
    constructor(blockAssign, setAssign) {
        this.allOn = false
        this.opennum = 0

        this.soundsets = setAssign.map((d, i) => ({
            name: d.name,
            sets: d.sets.map((pitch) => this.getAudioObject(pitch))
        }))

        this.blocks = blockAssign.map((d, i) => ({
            name: d.name,
            el: $(d.selector),
            opened: d.opened,
            icon: d.icon

        }))


    }


    playSet(type) {
        let sets = this.soundsets.find((set) => set.name == type).sets
        console.log("sets: " + sets)

        sets.forEach(element => {
            element.currentTime = 0
            setTimeout(() => {
                element.play()
            }, 1000)

        });
    }

    getAudioObject = function(pitch) {
        return new Audio("https://awiclass.monoame.com/pianosound/set/" + pitch + ".wav")
    }


    openCard(note) {

        let i = 0
        this.opennum += 1

        if (this.opennum == 1) {
            this.firstBlock = this.blocks.find(d => d.name == note)
            this.firstBlock.el.addClass("open show")


        } else if (this.opennum == 2) {


            this.opennum = 0

            this.secondBlock = this.blocks.find(d => d.name == note)
            this.secondBlock.el.addClass("open show")


            if (this.firstBlock.icon == this.secondBlock.icon) {
                console.log("got it!")
                this.playSet("correct")

                blocksdata.find(d => d.name == this.firstBlock.name).opened = "Yes"
                blocksdata.find(d => d.name == this.secondBlock.name).opened = "Yes"

                this.blocks.find(d => d.name == this.firstBlock.name).opened = "Yes"
                this.blocks.find(d => d.name == this.secondBlock.name).opened = "Yes"


            } else {

                for (i = 0; i < this.blocks.length; i++) {
                    this.blocks[i].el.addClass("notclick")
                        // console.log("add finish: " + i)

                }
                console.log("wrong!")
                this.playSet("wrong")

                setTimeout(() => {
                    this.firstBlock.el.removeClass("open show")
                    this.secondBlock.el.removeClass("open show")

                    for (i = 0; i < this.blocks.length; i++) {

                        this.blocks[i].el.removeClass("notclick")
                            // console.log("remove finish: " + i)

                    }

                }, 1000)
            }





        }

    }

    showImg(level) {
        let showtime = 0
        let i = 0
        switch (level) {
            case 0:
                console.log("case 0: show 3s")
                showtime = 3000
                break
            case 1:
                console.log("case 1: show 2s")
                showtime = 2000
                break
            case 2:
                console.log("case 1: show 1s")
                showtime = 1000
                break

        }



        for (i = 0; i < this.blocks.length; i++) {

            this.blocks[i].el.addClass("open show")
            console.log("open and show")

        }


        setTimeout(() => {
            for (i = 0; i < this.blocks.length; i++) {
                this.blocks[i].el.removeClass("open show")
            }

        }, showtime)






    }

}

class Game {
    constructor() {

        this.STATE = {
            "READY": "ready",
            "PLAYING": "playing"
        }
        this.state = this.STATE.READY
        this.level = 0



        // this.level = level
        // this.innerhtml(this.level)

        this.startGame()






    }

    getRandom(x) {
        return Math.floor(Math.random() * x);
    }

    innerhtml(level) {
        blocksArea.innerHTML = "";
        let blocksnum = (level + 1) * 2
        let iconnum = ((level + 1) * 2) * ((level + 1) * 2) / 2
        console.log("iconnum: " + iconnum)
        let liTag = ""
        var i = 0;
        var j = 0;
        let iconindex = 0
        var quit = 0

        for (i = 0; i < blocksnum; i++) {
            const rowDiv = document.createElement('div')
            rowDiv.className = 'row row' + i

            document.querySelector('.blocks').appendChild(rowDiv)

            for (j = 0; j < blocksnum; j++) {
                const blockDiv = document.createElement('div')

                // iconindex = this.getRandom(iconnum)
                // blockDiv.className = 'block block' + i + j + icondata[iconindex]


                blockDiv.setAttribute("onclick", "game.userSendInput(" + i + j + ")")
                document.querySelector('.row' + i).appendChild(blockDiv)
                    // iconindex = this.getRandom(iconnum)
                quit = 0

                while (!quit) {
                    console.log("while")
                    iconindex = this.getRandom(iconnum)

                    let iconused1 = blocksdata.find((set) => (set.iconused == 1 && set.icon == icondata[iconindex]))
                    let iconused2 = blocksdata.find((set) => (set.iconused == 2 && set.icon == icondata[iconindex]))



                    if (!iconused1 && !iconused2) {
                        console.log("input 1: " + i + j + ", " + icondata[iconindex])
                        blockDiv.className = 'block block' + i + j + icondata[iconindex]
                        blocksdata.push({ selector: '.block' + i + j, name: "" + i + j, opened: 'No', icon: icondata[iconindex], iconused: 1 });
                        quit = 1

                    } else if (iconused1 && !iconused2) {
                        console.log("input 2: " + i + j + ", " + icondata[iconindex])
                        blockDiv.className = 'block block' + i + j + icondata[iconindex]
                        blocksdata.push({ selector: '.block' + i + j, name: "" + i + j, opened: 'No', icon: icondata[iconindex], iconused: 2 });
                        quit = 1
                    } else if (iconused1 && iconused2) {
                        console.log("input 1 and 2: " + iconused1.name + " & " + iconused2.name + ", " + icondata[iconindex])
                            // blockDiv.className = 'open show block block' + i + j + icondata[iconindex]
                            // blocksdata.push({ selector: '.block' + i + j, name: "" + i + j, opened: 'No', icon: icondata[iconindex], iconused: 1 });
                        quit = 0


                    }
                    console.log("check")
                }
                console.log("end of while: ")
                    // blockDiv.className = 'open show block block' + i + j + icondata[iconindex]
                    // blocksdata.push({ selector: '.block' + i + j, name: "" + i + j, opened: 'No', icon: icondata[iconindex], iconused: 1 });



            }

        }


    }


    startGame() {
        $(".status").text("Level " + this.level)
        this.innerhtml(this.level)

        this.blocks = new Blocks(blocksdata, soundsetdata)

        this.blocks.showImg(this.level)



    }

    userSendInput(inputChar) {
        let i = 0
        this.state = this.PLAYING
        let answerChar1 = inputChar
        console.log("inputhar: " + answerChar1)
        this.playNote(inputChar)

        let allblocks = blocksdata.find(d => (d.opened == "No"))


        if (!allblocks) {
            console.log("finish")
            this.level += 1
            if (this.level == 3) {
                this.level = 0
            }
            blocksdata = []
            this.startGame()

            // gamelevel += 1

            // if (gamelevel == 3) {
            //     gamelevel = 0
            //     this.startGame(gamelevel)
            // } else {
            //     this.startGame(gamelevel)
            // }


        }

    }

    playNote(inputChar) {
        this.blocks.openCard(inputChar)
    }



}

var game = new Game()