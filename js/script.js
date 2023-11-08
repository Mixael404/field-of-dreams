function isCookiesHaveKey(key) {
    return document.cookie.includes(key) == true;
}
// document.cookie = "state=[] ; expires=Tue, 19 Jan 2018 03:14:07 GMT"
// document.cookie = "word="

class Game {
    constructor(setup) {
        const isCookiesHaveState = isCookiesHaveKey("state");
        const isCookiesHavePlayers = isCookiesHaveKey("players");
        const isCookiesHaveWord = isCookiesHaveKey("word");
        const isCookiesHaveQuestion = isCookiesHaveKey("question");
        const isCookiesHaveCurrentPlayer = isCookiesHaveKey("currentplayer");
        console.log(isCookiesHaveState);

        if (!isCookiesHaveState) {
            this.createCookieKey("state=[]");
        }
        if (!isCookiesHavePlayers) {
            this.createCookieKey("players=[]");
        }
        if (!isCookiesHaveWord) {
            this.createCookieKey("word=[]");
        }
        if (!isCookiesHaveQuestion) {
            this.createCookieKey("question=[]");
        }
        if (!isCookiesHaveCurrentPlayer) {
            this.createCookieKey("currentplayer=")
        }


        this.root = document.querySelector(setup.root);

        if (!this.root.classList.contains("relative")) {
            this.root.classList.add("relative");
        }

        this.questionWrapper = this.root.querySelector(".questionWrapper");
        console.log(this.questionWrapper);
        this.wordWrapper = this.root.querySelector(".wordWrapper");
        this.fieldsWrapper = this.root.querySelector(".fieldsWrapper");
        this.checkBtn = this.root.querySelector(".enterBtn");
        this.inputLetter = this.root.querySelector(".letterEnter");
        this.wordFullSection = this.root.querySelector(".fullInput")
        this.letterSection = this.root.querySelector(".oneLetter");
        this.fullWordBtn = this.root.querySelector(".fullWordBtn");
        this.oneLetterBtn = this.root.querySelector(".lettersBtn");
        this.table = this.root.querySelector("table>tbody");
        this.playerLabel = this.root.querySelector(".currentPlayer");
        this.newGameBtn = this.root.querySelector(".newGame");

        this.amountOfPlayers = setup.players;
        this.wordsForPlay = setup.words;
        this.questions = setup.questions;
        this.fullScore = new Array(setup.players).fill(0);
        this.players = new Array(this.amountOfPlayers);
        this.currentPlayer = 0;
        this.startNewGame();
        // this.init();
        this.scoreRow = this.table.children[1];

        this.addEventListeners();
        this.playerLabel.textContent = `Ход игрока ${(this.currentPlayer + 1)}`;
    }

    init() {
        this.wordArray = this.getData("word");
        this.question = this.getData("question");
        this.state = this.getData("state");
        this.checkedLetters = [];
        this.players = this.getData("players");
        this.currentPlayer = this.getData("currentplayer");
        this.setVisualElements();
        this.setScoreTable();
        this.drawLetters();
        console.log(this.wordArray);
        this.playerLabel.textContent = `Ход игрока ${(this.currentPlayer + 1)}`;
    }

    addEventListeners() {
        this.fullWordBtn.addEventListener("click", this.changeInputType.bind(this));
        this.oneLetterBtn.addEventListener("click", this.changeInputType.bind(this));
        this.checkBtn.addEventListener("click", this.lettersInput.bind(this));
        this.checkBtn.addEventListener("click", this.wordWin.bind(this));
        this.newGameBtn.addEventListener("click", this.startNewGame.bind(this));
    }



    createElement(tag, wrapper, styleClass, text) {
        const element = document.createElement(tag);
        if (element.tagName == "INPUT") {
            element.maxLength = "1";
        }
        if (text) {
            element.textContent = text;
        }
        element.classList.add(styleClass);
        wrapper.append(element);
    }

    setVisualElements() {
        this.wordWrapper.innerHTML = "";
        this.fieldsWrapper.innerHTML = "";
        this.questionWrapper.innerHTML = "";
        this.questionWrapper.textContent = this.question;
        for (let i = 0; i < this.wordArray.length; i++) {
            this.createElement("div", this.wordWrapper, "letterWrapper");
            this.createElement("input", this.fieldsWrapper, "field");
        }
    }

    setScoreTable() {
        this.table.children[0].innerHTML = "";
        this.table.children[1].innerHTML = "";
        for (let i = 0; i < this.players.length; i++) {
            const playerName = document.createElement("td", "", "");
            const playerScore = document.createElement("td", "", "")
            playerName.textContent = "player " + (i + 1);
            playerScore.textContent = this.players[i];
            this.table.children[0].append(playerName);
            this.table.children[1].append(playerScore);
        }
    }

    updateScoreTable(scoreArr) {
        for (let i = 0; i < this.players.length; i++) {
            this.scoreRow.children[i].textContent = scoreArr[i];
        }
    }

    findLetters(letterToFind) {
        let indexes = [];
        this.wordArray.forEach(function (letter, index) {
            if (letter == letterToFind) {
                indexes.push(index);
            }
        })
        return indexes;
    }

    drawLetters() {
        this.state.forEach((letter, index) => {
            // false , null, NaN,
            // 0, "0"
            // if (letter){
            if (letter != undefined) {
                this.wordWrapper.children[index].textContent = letter;
                this.fieldsWrapper.children[index].value = letter;
                this.fieldsWrapper.children[index].disabled = true;
            }
        })
    }


    changeInputType(typeOperation) {
        this.wordFullSection.classList.toggle("collapsed");
        this.letterSection.classList.toggle("collapsed");
        this.fullWordBtn.classList.toggle("collapsed");
        this.oneLetterBtn.classList.toggle("collapsed");
    }

    lettersInput() {
        const letterInputHidden = this.letterSection.classList.contains("collapsed");
        const wordIncludesLetter = this.wordArray.includes(this.inputLetter.value);
        const letterAlreadyWas = this.checkedLetters.includes(this.inputLetter.value);
        if (letterInputHidden) {
            return;
        }

        if (this.inputLetter.value == "") {
            return;
        }

        if (letterAlreadyWas) {
            this.inputLetter.value = "";
            return;
        }
        if (!wordIncludesLetter) {
            this.inputLetter.value = "";
            this.nextPlayer();
        }
        if (wordIncludesLetter) {
            const letter = this.inputLetter.value;
            const indexes = this.findLetters(letter);
            for (let index of indexes) {
                this.state[index] = letter;
            }
            this.drawLetters();
            this.inputLetter.value = "";
            this.players[this.currentPlayer] += 100 * this.generateRandomInt(5);
            this.checkedLetters.push(letter);
            this.updateScoreTable(this.players);
            this.pushToCookie("players", this.players)
            this.pushToCookie("state", this.state)
        }
        this.checkWinByLastLetterInput();
        this.playerLabel.textContent = `Ход игрока ${(this.currentPlayer + 1)}`;
    }



    wordWin() {
        const wordFullInputHidden = this.wordFullSection.classList.contains("collapsed");
        if (wordFullInputHidden) {
            return;
        }
        let word = [];

        for (let i = 0; i < this.fieldsWrapper.children.length; i++) {
            word.push(this.fieldsWrapper.children[i].value);
        }


        if (word.join("") == this.wordArray.join("")) {
            console.log("Победил " + (this.currentPlayer + 1));
            this.players[this.currentPlayer] += 1000;
            this.refreshAfterWin();
            this.changeInputType();
        } else {
            // Стирание активных инпутов после неправильного ввода слова
            for (let i = 0; i < this.fieldsWrapper.children.length; i++) {
                if (this.fieldsWrapper.children[i].disabled == false) {
                    this.fieldsWrapper.children[i].value = "";
                }
            }
            console.log("Поражение :(");
            this.players[this.currentPlayer] -= 1000;
            this.updateScoreTable(this.players);
            this.nextPlayer()
            this.playerLabel.textContent = `Ход игрока ${(this.currentPlayer + 1)}`;
        }
    }

    refreshAfterWin() {
        for (let i = 0; i < this.fullScore.length; i++) {
            this.fullScore[i] += this.players[i];
        }
        console.log(this.fullScore);
        this.word = this.wordsForPlay[this.generateRandomInt(4)];
        this.showWin();
        this.currentPlayer = 0;
        this.playerLabel.textContent = `Ход игрока ${(this.currentPlayer + 1)}`;
        this.startNewGame();
    }

    checkWinByLastLetterInput() {
        if (this.state.toString() == this.wordArray.toString()) {
            console.log("Победа!");
            this.players[this.currentPlayer] += 300;
            this.updateScoreTable(this.players);
            this.refreshAfterWin();
        }
    }

    showWin() {
        this.createElement("p", this.root, "winString", `Победил ${this.currentPlayer + 1}`);
        setTimeout(this.deleteWin, 2000);
    }

    //TODO находить строку в root вместо document
    deleteWin() {
        const str = document.querySelector(".winString");
        str.remove();
    }

    nextPlayer() {
        if (this.currentPlayer == this.players.length - 1) {
            this.currentPlayer = 0;
        } else {
            this.currentPlayer++;
        }
        document.cookie = "currentplayer=" + this.currentPlayer;
    }

    generateRandomInt(max) {
        let maxNumber = Math.floor(Math.random() * max);
        if (maxNumber == 0) {
            maxNumber = 1;
        }
        return maxNumber;
    }

    generateWord() {
        const index = this.generateRandomInt(6);
        this.word = this.wordsForPlay[index];
        this.question = this.questions[index];
        console.log(this.question);
        this.lowerCaseWord = this.word.toLowerCase();
        this.encodedWord = encodeURIComponent(this.lowerCaseWord);
        this.wordArray = this.lowerCaseWord.split("");
        //  pushToCookie(key, data)
        document.cookie = "word=" + this.encodedWord;
        this.pushToCookie("question", this.question);
    }

    startNewGame() {
        document.cookie = "state=[]";
        this.players = new Array(this.amountOfPlayers);
        let playersArr = this.players.fill(0);
        this.pushToCookie("players", playersArr);
        document.cookie = "currentplayer=0";
        this.generateWord();
        this.init();
    }




    // Cookie functions

    createCookieKey(cookie) {
        document.cookie = cookie + "; expires=Tue, 19 Jan 2038 03:14:07 GMT"
    }

    pushToCookie(key, data) {
        const stringState = JSON.stringify(data);
        const encodedArray = encodeURIComponent(stringState);
        document.cookie = key + "=" + encodedArray;
    }

    getDataFromCookie(key) {
        let cookieValue;
        const splittedAllCookie = document.cookie.split("; ");
        splittedAllCookie.forEach((cookie) => {
            const splittedCookie = cookie.split("=");
            if (splittedCookie[0] == key) {
                cookieValue = splittedCookie[1];
            }
        })
        return cookieValue;
    }

    getData(key) {
        const currentData = this.getDataFromCookie(key);
        const decodedData = decodeURIComponent(currentData);
        let arrData;
        if (key == "word") {
            arrData = decodedData.split("");
        } else if (key == "currentplayer") {
            arrData = +(decodedData);
        } else {
            arrData = JSON.parse(decodedData);
        }
        return arrData;

        // return JSON.parse(decodeURIComponent(this.getStateFromCookie()));
    }
}



const game1 = {
    root: ".game1",
    word: "мама",
    players: 3,
    words: ["", "солома", "река", "крабик", "дом", "дверь"],
    questions: ["", "Антоним сена", "Текущая вода", "Краб ласково", "Жильё человека", "Предмет разделяющий помещение на комнаты"],
    name: "Mikhail"
}
const newGame = new Game(game1);