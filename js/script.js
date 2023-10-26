// const wordWrapper = document.querySelector(".wordWrapper");
// const fieldsWrapper = document.querySelector(".fieldsWrapper");
// const checkBtn = document.querySelector(".enterBtn");
// const inputLetter = document.querySelector(".letterEnter");
// const wordFullSection = document.querySelector(".fullInput")
// const letterSection = document.querySelector(".oneLetter");
// const fullWordBtn = document.querySelector(".fullWordBtn");
// const oneLetterBtn = document.querySelector(".lettersBtn");



class Game {
    constructor(setup) {
        const root = document.querySelector(setup.root);
        this.wordWrapper = root.querySelector(".wordWrapper");
        this.fieldsWrapper = root.querySelector(".fieldsWrapper");
        this.checkBtn = root.querySelector(".enterBtn");
        this.inputLetter = root.querySelector(".letterEnter");
        this.wordFullSection = root.querySelector(".fullInput")
        this.letterSection = root.querySelector(".oneLetter");
        this.fullWordBtn = root.querySelector(".fullWordBtn");
        this.oneLetterBtn = root.querySelector(".lettersBtn");
        this.table = root.querySelector("table>tbody");
        console.log(this.table.children[1]);
        this.playerLabel = root.querySelector(".currentPlayer")

        this.wordsForPlay = setup.words;        
        this.word = this.wordsForPlay[this.generateRandomInt(4)];
        console.log(this.word);
        this.fullScore = new Array(setup.players).fill(0);
        this.players = new Array(setup.players);
        this.currentPlayer = 0;


        this.init();
        this.scoreRow = this.table.children[1];
        this.addEventListeners();
        this.playerLabel.textContent = `Ход игрока ${(this.currentPlayer + 1)}`;
    }

    init() {
        // TODO добавить обнуление players 
        this.lowerCaseWord = this.word.toLowerCase();
        this.wordArray = this.lowerCaseWord.split("");
        this.state = new Array(this.wordArray.length);
        this.checkedLetters = [];
        this.players.fill(0);
        this.setVisualElements();
        this.setScoreTable()
    }

    addEventListeners(){
        this.fullWordBtn.addEventListener("click", this.changeInputType.bind(this));
        this.oneLetterBtn.addEventListener("click", this.changeInputType.bind(this));
        this.checkBtn.addEventListener("click", this.lettersInput.bind(this));
        this.checkBtn.addEventListener("click", this.wordWin.bind(this));
    }



    createElement(tag, wrapper, styleClass, text){
        const element = document.createElement(tag);
        if(element.tagName == "INPUT"){
            element.maxLength = "1";
        }
        if(text){
            element.textContent = text;
        }
        element.classList.add(styleClass);
        wrapper.append(element);
    }

    setVisualElements() {
        this.wordWrapper.innerHTML = "";
        this.fieldsWrapper.innerHTML = "";
        for (let i = 0; i < this.wordArray.length; i++) {
            this.createElement("div", this.wordWrapper, "letterWrapper");
            this.createElement("input", this.fieldsWrapper, "field");
        }
    }

    setScoreTable(){
        this.table.children[0].innerHTML = "";
        this.table.children[1].innerHTML = "";
        for (let i = 0; i < this.players.length; i++){
            const playerName = document.createElement("td","", "");
            const playerScore = document.createElement("td", "" , "")
            playerName.textContent = "player " + (i + 1);
            playerScore.textContent = 0;
            this.table.children[0].append(playerName);
            this.table.children[1].append(playerScore);
        }
    }

    updateScoreTable(scoreArr){
        for (let i = 0; i < this.players.length; i++){
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

    drawLetters(indexes, letter) {
        for (let index of indexes) {
            this.wordWrapper.children[index].textContent = letter;
            this.fieldsWrapper.children[index].value = letter;
            this.fieldsWrapper.children[index].disabled = true;
            this.state[index] = letter;
        }
    }


    changeInputType() {
        this.wordFullSection.classList.toggle("collapsed");
        this.letterSection.classList.toggle("collapsed");
        this.fullWordBtn.classList.toggle("collapsed");
        this.oneLetterBtn.classList.toggle("collapsed");
    }

    lettersInput() {
        if (this.letterSection.classList.contains("collapsed")) {
            return;
        }

        if (this.inputLetter.value == "") {
            return;
        }

        if (this.checkedLetters.includes(this.inputLetter.value)){
            this.inputLetter.value = "";
            return;
        }
        if (!this.wordArray.includes(this.inputLetter.value)) {
            this.inputLetter.value = "";
            this.nextStep();
        }
        if (this.wordArray.includes(this.inputLetter.value)) {
            const letter = this.inputLetter.value;
            const indexes = this.findLetters(letter);
            this.drawLetters(indexes, letter);
            this.inputLetter.value = "";
            this.players[this.currentPlayer] += 100 * this.generateRandomInt(5);
            this.checkedLetters.push(letter);
            this.updateScoreTable(this.players);
        }
        this.checkWinByLastLetterInput();
        this.playerLabel.textContent = `Ход игрока ${(this.currentPlayer + 1)}`;
    }



    wordWin() {
        if (this.wordFullSection.classList.contains("collapsed")) {
            return;
        }
        let word = [];
        for (let i = 0; i < this.fieldsWrapper.children.length; i++) {
            word.push(this.fieldsWrapper.children[i].value);
        }
        if (word.join("") == this.lowerCaseWord) {
            console.log("Победил " + (this.currentPlayer + 1));
            this.players[this.currentPlayer] += 1000;
            this.refreshAfterWin();
            this.changeInputType();
        } else {
            // Стирание активных инпутов после неправильного ввода слова
            for (let i = 0; i < this.fieldsWrapper.children.length; i++) {
                if(this.fieldsWrapper.children[i].disabled == false){
                    this.fieldsWrapper.children[i].value = "";
                }
            }
            console.log("Поражение :(");
            this.players[this.currentPlayer] -= 1000;
            this.updateScoreTable(this.players);
            this.nextStep()
            this.playerLabel.textContent = `Ход игрока ${(this.currentPlayer + 1)}`;
        }
    }

    refreshAfterWin(){
        for (let i = 0; i < this.fullScore.length; i++){
            this.fullScore[i] += this.players[i];
        }
        console.log(this.fullScore);
        this.word = this.wordsForPlay[this.generateRandomInt(4)];
        this.showWin();
        this.currentPlayer = 0;
        this.init();
    }

    checkWinByLastLetterInput(){
        if (this.state.toString() == this.wordArray.toString()){
            console.log("Победа!");
            this.players[this.currentPlayer] += 300;
            this.updateScoreTable(this.players);
            this.refreshAfterWin();
        }
    }

    showWin(){
        console.log(this.currentPlayer);
        this.createElement("p", document.body, "winString", `Победил ${this.currentPlayer + 1}`);
    }


    nextStep(){
        if (this.currentPlayer == this.players.length - 1){
            this.currentPlayer = 0;
        } else {
            this.currentPlayer++;
        }
    }

    generateRandomInt(max){
        let maxNumber = Math.floor(Math.random() * max);
        if (maxNumber == 0){
            maxNumber = 1;
        }
        return maxNumber;
    }
}



const game1 = {
    root: ".game1",
    word: "мама",
    players: 2,
    words: ["солома", "река", "крабик", "дом", "дверь"],
    name: "Mikhail"
}
const newGame = new Game(game1);