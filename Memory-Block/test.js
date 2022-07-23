// Block has flash func, and in flash will triggle sound.

interface BlocksObj {
    selector: string;
    name: string;
    pitch: number;
    el ? : any;
    audio ? : any;
}
interface SoundItem {
    pitch: number[];
    audio: number[];
}
interface SoundObj {
    correct: SoundItem;
    wrong: SoundItem;
}

const blocksArr: BlocksObj[] = Array.apply(null, Array(4)).map((_, index) => ({
    selector: `.block${index + 1}`,
    name: (index + 1).toString(),
    pitch: index + 1
}));

const soundObj: SoundObj = {
    correct: {
        pitch: [3, 4, 5, 6, 7, 8]
    },
    wrong: {
        pitch: [5.5, 8.5, 9.5]
    }
}

class Blocks {
    blocksArr: BlocksObj[];
    soundObj: SoundObj;
    // isTurnOnAll: boolean;
    // isTurnOffAll: boolean;
    constructor(blocksArr: BlocksObj[], soundObj: SoundObj) {
        this.blocksArr = blocksArr.map((item, index) => ({
            ...item,
            el: document.querySelector(item.selector),
            audio: this.getAudioObj(item.pitch)
        }));
        this.soundObj = {
            correct: soundObj.correct.pitch.map(pitch => ({
                audio: this.getAudioObj(pitch)
            })),
            wrong: soundObj.wrong.pitch.map(pitch => ({
                audio: this.getAudioObj(pitch)
            }))
        };
        // this.isTurnOnAll = false;
        // this.isTurnOffAll = false;
    }

    flash(name: string) {
        const block = this.blocksArr.find((item) => item.name === name);
        const blockCls = block.el.classList;
        blockCls.add('active');
        this.playAudio(block);
        setTimeout(() => blockCls.remove('active'), 100);
    }

    turnOnAll() {
        this.blocksArr.map((item, index) => {
            const block = item.el.classList;
            block.add('active');
        });
    }

    turnOffAll() {
        this.blocksArr.map((item) => {
            const block = item.el.classList;
            block.remove('active');
        });
    }

    getAudioObj(pitch: number) {
        const audio = `https://awiclass.monoame.com/pianosound/set/${pitch}.wav`;
        return new Audio(audio);
    }

    playAudio(item) {
        const audio = item.audio;
        audio.currentTime = 0;
        audio.play();
    }

    playSoundMode(key: string) {
        if (!this.soundObj[key]) {
            return;
        }
        this.soundObj[key].map(
            (item, index) => setTimeout(() => this.playAudio(item), index * 100));
    }
}

class Game {
    answer: string;
    blocks: Blocks;
    currentLevel: number;
    gameStatus: string;
    levelData: Array < string > ;
    playInterval: number;
    userInput: string;
    timer;
    constructor(levelData: Array < string > ) {
        this.blocks = new Blocks(blocksArr, soundObj);
        this.currentLevel = 0;
        this.levelData = levelData;
        this.playInterval = 400;
        this.gameStatus = 'waiting';
    }

    startGame(answer: string) {
        this.answer = answer;
        let splitAnswer = answer.split('');
        this.timer = setInterval(() => {
            const pitch = splitAnswer.shift();
            this.blocks.flash(pitch);
            if (splitAnswer.length === 0) {
                clearInterval(this.timer);
                this.showMsg(`Level - ${this.currentLevel}`);
                this.showStatus();
                this.gameStatus = 'userInput';
                this.userInput = '';
            }
        }, this.playInterval);
    }

    sendUserInput(userInput: string) {
        if (this.gameStatus !== 'userInput') {
            return;
        }
        this.userInput += userInput;
        this.showStatus(this.userInput);
        if (this.answer.indexOf(this.userInput) === 0) {
            this.blocks.flash(userInput);
            if (this.userInput === this.answer) {
                this.blocks.playSoundMode('correct');
                this.currentLevel++;
                this.showMsg('Correct');
                this.gameStatus = 'waiting';
                this.blocks.turnOnAll();
                setTimeout(() => {
                    this.blocks.turnOffAll();
                }, 500);
                setTimeout(() => {
                    this.startGame(this.levelData[this.currentLevel]);
                }, 1000);
            }
        } else {
            this.blocks.playSoundMode('wrong');
            this.showMsg('Wrong');
            this.gameStatus = 'waiting';
            this.showStatus();
            this.blocks.turnOnAll();
            setTimeout(() => {
                this.blocks.turnOffAll();
            }, 500);
            // this.currentLevel = 0;
            setTimeout(() => {
                this.startGame(this.levelData[this.currentLevel]);
            }, 1000);
        }
    }

    showMsg(wording: string) {
        document.querySelector('.level').innerText = wording;
    }

    showStatus(userString = '') {
        document.querySelector('.status').innerHTML = '';
        const userStringLength = userString.length;
        Array.from(this.levelData[this.currentLevel]).map((item, index) => {
            const div = document.createElement('DIV');
            div.className = 'circle';
            if (userStringLength > index) {
                div.className += ' correct';
            }
            document.querySelector('.status').appendChild(div);
        });
    }
}

const levelData = [
    '1332',
    '4421',
    '1234',
    '22343',
    '123134',
    '1241233',
    '1123341',
    '124312341',
    '442341231',
    '114121341432'
];

const game = new Game(levelData);

game.startGame(levelData[0]);
document.body.addEventListener('keydown', ({ key }) => {
    console.log('key', key);
    const keyObj = {
        a: '1',
        s: '2',
        k: '3',
        l: '4'
    };
    if (keyObj[key.toLowerCase()]) {
        game.sendUserInput(keyObj[key]);
    }
});