// Block
var blockdata = [
    { selector: ".block1", name: "1", pitch: "1" },
    { selector: ".block2", name: "2", pitch: "2" },
    { selector: ".block3", name: "3", pitch: "3" },
    { selector: ".block4", name: "4", pitch: "4" }
]

var soundsetdata = [
    { name: "correct", sets: [1, 2, 5, 8] },
    { name: "wrong", sets: [1, 1, 1, 1] }
]

//接著定義每個關卡的資料
var levelDatas = [
    "1234",
    "12324",
    "231234",
    "41233412",
    "232421234",
    "3434321222",
    "223322114231"
]


var Blocks = function(blockAssign, setAssign) {
    this.allOn = false


    this.blocks = blockAssign.map((d, i) => ({
        name: d.name,
        el: $(d.selector),
        audio: this.getAudioObject(d.pitch)
    }))


    this.soundSets = setAssign.map((d, i) => ({
        name: d.name,
        sets: d.sets.map((pitch) => this.getAudioObject(pitch))
    }))

}

// flash
Blocks.prototype.flash = function(note) {
    let block = this.blocks.find(d => d.name == note)
    if (block) {
        block.el.addClass("active")

        block.audio.currentTime = 0
        block.audio.play()

        block.el.addClass("active")

        setTimeout(() => {
            block.el.removeClass("active")
        }, 300)


    }
}

Blocks.prototype.turnAllOn = function() {
    this.allon = true
    this.blocks.forEach((block) => {
        block.el.addClass("active")
    })
}

Blocks.prototype.turnAllOff = function() {
    this.allon = false
    this.blocks.forEach((block) => {
        block.el.removeClass("active")
    })
}


Blocks.prototype.getAudioObject = function(pitch) {
    return new Audio("https://awiclass.monoame.com/pianosound/set/" + pitch + ".wav")
}

Blocks.prototype.playSet = function(type) {
    let sets = this.soundSets.find((set) => set.name == type).sets
    sets.forEach((obj) => {
        obj.currentTime = 0
        obj.play()
    })
}

//Game
//將原本的 var blocks = new Blocks(blockdata,soundsetdata) 搬入給game 使用
var Game = function() {

    this.STATE = {
        'READY': 'ready',
        'PLAYING': 'playing',
    }
    this.state = this.STATE.READY;
    $(".status").text("Click block to start")
    document.addEventListener('click', e => {
        if (this.state == this.STATE.READY) {
            game.startLevel()
        }

    });


    this.blocks = new Blocks(blockdata, soundsetdata)
    this.levels = levelDatas
        //目前的關卡
    this.currentLevel = 0
        //播放的速度
    this.playInterval = 400
        //遊戲狀態
    this.mode = "waiting"

}


Game.prototype.startGame = function(answer) {
    this.mode = "gamePlay"
        //把輸入一個個的撥放 
        //1.先把它拆解開來 
        //console input: "1234".split("") ->拆解成1 2 3 4
        //console: var list="1234".split("")
        //list
        //list.shift() ,list 逐步的播放與清空
        //直到他成為空的就可以讓使用者輸入

    this.answer = answer
    let notes = this.answer.split("")
    this.showStatus("")

    this.timer = setInterval(() => {
        let char = notes.shift()
            // check finish playing


        this.playNote(char)
            // console.log("note: " + notes)

        //看看是否有正確取出
        console.log("char: " + char)

        if (notes.length == 0) {
            //關掉計時器
            this.startUserInput()
            clearInterval(this.timer) //需要關掉計時器，否則會不斷重複
            console.log("audio play end")

        }


    }, this.playInterval)


}

Game.prototype.playNote = function(note) {
    // console.log("note: " + note)
    this.blocks.flash(note)
}

Game.prototype.startUserInput = function() {
    this.userInput = ""
    this.mode = "userInput"
}

Game.prototype.userSendInput = function(inputChar) {
    // this.userInput = ""
    // this.mode = "userInput"


    if (this.mode == "userInput") {
        this.state = this.STATE.PLAYING
        let tempString = this.userInput + inputChar

        this.playNote(inputChar)
        this.showStatus(tempString)

        if (this.answer.indexOf(tempString) == 0) {
            // console.log("tempString: " + tempString)
            // console.log("userInput: " + this.userInput)
            // console.log("inputChar: " + inputChar)
            console.log("answer.indoxof: " + this.answer.indexOf(tempString))
            console.log("Good Job")

            if (this.answer == tempString) {
                console.log("Correct")
                this.showMessage("Correct!")
                this.currentLevel += 1
                this.mode = "waiting"
                this.blocks.turnAllOn();
                this.blocks.playSet("correct")
                setTimeout(() => {
                    this.blocks.turnAllOff();
                }, 500);
                setTimeout(() => {
                    this.startLevel()
                }, 1000)
            }

        } else {
            console.log("Wrong")
            this.showMessage("Wrong!")
            this.currentLevel = 0
            this.mode = "waiting"
            this.blocks.turnAllOn();
            this.blocks.playSet("wrong")
            setTimeout(() => {
                this.blocks.turnAllOff();
            }, 500);
            setTimeout(() => {
                this.startLevel()
            }, 1000)
            this.state = this.STATE.END
        }

        console.log("tempString: " + tempString)
        this.userInput += inputChar
    }
}

Game.prototype.startLevel = function() {
    this.showMessage("Level " + this.currentLevel)
    let leveldata = this.levels[this.currentLevel]
    this.startGame(leveldata)
}

Game.prototype.showMessage = function(mes) {
    console.log(mes)
    $(".status").text(mes)
}

Game.prototype.showStatus = function(tempString) {
    $(".inputStatus").html("")
    this.answer.split("").forEach((d, i) => {
        var circle = $("<div class='circle'></div>")
        if (i < tempString.length) {
            circle.addClass("correct")
        }
        $(".inputStatus").append(circle)
    })

    if (tempString == "") {
        this.blocks.turnAllOff()
    }

    if (this.answer == tempString) {
        $(".inputStatus").addClass("correct")

    } else {
        //使用者未輸入完整
        $(".inputStatus").removeClass("correct")
    }

    if (this.answer.indexOf(tempString) != 0) {
        $(".inputStatus").addClass("wrong")

    } else {
        $(".inputStatus").removeClass("wrong")
    }



}

var game = new Game()
    // game.startLevel()

// game.startGame("1234")