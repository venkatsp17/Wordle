const WORDS = ["apple", "candy", "timer", "dates", "elder"];
const MAX_ATTEMPTS = 6;
let currentAttempt = 0;
let currentWord = "";
let targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
let board = document.getElementById("board");
let keyboard = document.getElementById("keyboard");
let celebration = document.getElementById("celebration");

function initBoard() {
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        for (let j = 0; j < 5; j++) {
            let tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id = `tile-${i}-${j}`;
            board.appendChild(tile);
        }
    }
}

function initKeyboard() {
    const rows = [
        "qwertyuiop",
        "asdfghjkl",
        "zxcvbnm"
    ];

    rows.forEach((row) => {
        for (let char of row) {
            let key = document.createElement("div");
            key.classList.add("key");
            key.innerText = char;
            key.addEventListener("click", () => handleKeyPress(char));
            keyboard.appendChild(key);
        }
    });

    let enterKey = document.createElement("div");
    enterKey.classList.add("key", "wide");
    enterKey.innerText = "Enter";
    enterKey.addEventListener("click", handleSubmit);
    keyboard.appendChild(enterKey);

    let backspaceKey = document.createElement("div");
    backspaceKey.classList.add("key", "wide");
    backspaceKey.innerText = "←";
    backspaceKey.addEventListener("click", handleBackspace);
    keyboard.appendChild(backspaceKey);

    // Add event listener to capture keyboard input
    document.addEventListener("keydown", (event) => {
        if (/^[a-zA-Z]$/.test(event.key)) {
            handleKeyPress(event.key.toLowerCase());
        } else if (event.key === "Enter") {
            handleSubmit();
        } else if (event.key === "Backspace") {
            handleBackspace();
        }
    });
}

function handleKeyPress(char) {
    if (currentWord.length < 5) {
        currentWord += char;
        let tile = document.getElementById(`tile-${currentAttempt}-${currentWord.length - 1}`);
        tile.innerText = char;
    }
}

function handleBackspace() {
    if (currentWord.length > 0) {
        let tile = document.getElementById(`tile-${currentAttempt}-${currentWord.length - 1}`);
        tile.innerText = "";
        currentWord = currentWord.slice(0, -1);
    }
}

function handleSubmit() {
    if (currentWord.length < 5) return;
    checkWord();
    if (currentWord === targetWord) {
        showCelebration();
    } else {
        currentAttempt++;
        currentWord = "";
        if (currentAttempt === MAX_ATTEMPTS) {
            alert(`Game over! The word was ${targetWord}`);
            resetGame();
        }
    }
}

function checkWord() {
    let correctLetters = Array(5).fill(false);
    let correctCounts = {};

    for (let i = 0; i < 5; i++) {
        if (targetWord[i] === currentWord[i]) {
            correctLetters[i] = true;
            correctCounts[currentWord[i]] = (correctCounts[currentWord[i]] || 0) + 1;
        }
    }

    for (let i = 0; i < 5; i++) {
        let tile = document.getElementById(`tile-${currentAttempt}-${i}`);
        let key = getKey(currentWord[i]);
        if (correctLetters[i]) {
            tile.classList.add("correct");
            if (key) key.classList.add("correct");
        } else if (targetWord.includes(currentWord[i]) && (correctCounts[currentWord[i]] || 0) < targetWord.split(currentWord[i]).length - 1) {
            tile.classList.add("present");
            if (key) key.classList.add("present");
            correctCounts[currentWord[i]] = (correctCounts[currentWord[i]] || 0) + 1;
        } else {
            tile.classList.add("absent");
            if (key) key.classList.add("absent");
        }
    }
}

function getKey(char) {
    return Array.from(keyboard.children).find(key => key.innerText === char);
}

function showCelebration() {
    celebration.style.display = "block";
    setTimeout(() => {
        celebration.style.display = "none";
        resetGame();
    }, 2000);
}

function resetGame() {
    currentAttempt = 0;
    currentWord = "";
    targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    board.innerHTML = "";
    keyboard.innerHTML = "";
    initBoard();
    initKeyboard();
}

initBoard();
initKeyboard();
