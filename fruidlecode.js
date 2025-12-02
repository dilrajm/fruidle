let intervalID = null;
// Reference to lose popup
const losePopup = document.getElementById("Lose_popup");
const closeLosePopup = losePopup.querySelector(".close-button");
const tryAgainButton = document.getElementById("Again");

window.onload=function(){
    //load the homepage first

    // Check if there is a saved page in URL first
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash);


    } else {
        // If no saved page load homepage
        innitGame();
    }
    

    //get all help buttons
    const helpButtons=document.querySelectorAll(".help");
    const modal= document.getElementById("HowToPlayModal");
    const closeButton=document.getElementById("closeHowToPlay");

    window.addEventListener('click', (e) => {
    // Close How to Play modal if clicking backdrop
    if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
    
    // Close Lose popup if clicking backdrop
    if (e.target === losePopup) {
        losePopup.classList.remove("active");
        document.body.style.overflow = "auto";
    }
});

    helpButtons.forEach(button=>{
        button.onclick=()=>{
             modal.style.display="flex";
             // Prevent scrolling behind pop-up
             document.body.style.overflow = "hidden";
        };
    });



    closeButton.onclick=()=>{
        modal.style.display="none";
        // Scrolling returns once pop-up is closed.
        document.body.style.overflow = "auto";
    };

    
    // Close lose popup when X is clicked
    closeLosePopup.onclick = () => {
        losePopup.classList.remove("active");
        document.body.style.overflow = "auto";
    };
    
    // Try again button functionality
    tryAgainButton.onclick = () => {
        losePopup.classList.remove("active");
        document.body.style.overflow = "auto";
        // Restart the current level
        startlevel(game.level);
    };
}
function innitGame() {
    //homepage
    showPage("Homepage")
}

function startlevel(level) {
    // Make sure lose popup is hidden when starting a level
    losePopup.classList.remove("active");
    document.body.style.overflow = "auto";
    
    if (intervalID) {
        clearInterval(intervalID);
        intervalID = null;
    }
    if (level===0){
        showPage("Homepage");
    }
    else{
        showPage("Level_"+level);
    }
}

/**
 * This function for swithcing between visible pages
 */
function showPage(pageID){
    //hide all pages at the start
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active")     
    });
    //Show page
    document.getElementById(pageID).classList.add("active");

    // Makes sure lose popup disapears after clicking home
    losePopup.classList.remove("active");
    document.body.style.overflow = "auto";
    
    // Makes sure refresh stays on current page.
    window.location.hash = pageID;

    // Makes sure new page scrolls to top.
    window.scrollTo(0, 0);
    const timerEl = document.getElementById(pageID).querySelector(".timer");

    if (timerEl) timerEl.innerText = "00:00";

    if (intervalID) {
        clearInterval(intervalID);
        intervalID = null;
    }
}
const fruits=document.querySelectorAll(".fruit");
fruits.forEach(button =>{
    button.addEventListener("click",timer);
});


function timer() {
    const activePage = document.querySelector('.page.active');
    if (!activePage) {
        console.log("No active page found");
        return;
    }
    if (intervalID !== null) return;

    
    const output = activePage.querySelector('.timer');
    if (!output) {
        console.log("No timer element found on active page");
        return;
    }
    
    console.log("Starting timer on:", activePage.id); // Debug log
    
    let count = 0;
    let mcount = 0;
    
    if (intervalID) {
        clearInterval(intervalID);
        intervalID = null;
    }
    
    const result = document.getElementById("result");
    
    // Reset timer display first
    output.innerText = "00:00";
    
    intervalID = setInterval(() => {
        count++;
        if (count == 60) {
            mcount++;
            count = 0;
        }
        output.innerText = `${mcount.toString().padStart(2, '0')}:${count.toString().padStart(2, '0')}`;
    }, 1000);
}

/*
 ===================== SIMPLE FRUIDLE GAME LOGIC =====================

 Logical thought process for coding the game:

   - Each level has:
       - a specific word length (3, 5, or 7 fruits)
       - a pool of image filenames (PNG) to choose from
   - When a level starts, we have to do the following:
       1. generate a random secret sequence of images
       2. clear the grid visuals
       3. attach click handlers to fruit / delete / enter buttons
   - Player uses the fruit buttons to fill the current row
   - Delete removes the last fruit in the current row
   - Enter checks if the row is complete, then:
       - compares guess vs secret (Wordle style, no double yellow as the rule)
       - colours each tile (green / yellow / grey)
       - moves to next row OR locks the game on win/lose.
*/

// This object stores the allowed fruits + row size for each level.
// Nothing fancy — just a simple lookup.
const LEVELS = {
    1: {
        size: 3,
        pics: [
            "Fruidle_Images/grn_apple.png",
            "Fruidle_Images/pear.png",
            "Fruidle_Images/kiwi.png",
            "Fruidle_Images/melon.png"
        ]
    },
    2: {
        size: 5,
        pics: [
            "Fruidle_Images/lemon.png",
            "Fruidle_Images/banana.png",
            "Fruidle_Images/tangerine.png",
            "Fruidle_Images/pineapple.png"
        ]
    },
    3: {
        size: 7,
        pics: [
            "Fruidle_Images/apple.png",
            "Fruidle_Images/strawberry.png",
            "Fruidle_Images/cherries.png",
            "Fruidle_Images/watermelon.png"
        ]
    }
};

// this object stores all the data needed while the game is running.
// this is much easier than having 20 separate variables everywhere.
const game = {
    level: 0,      // current level (1, 2, or 3)
    secret: [],    // randomly generated answer sequence
    size: 0,       // how many fruits per row (3, 5, or 7)
    maxTries: 0,   // number of rows available in the grid (max 5 usually)
    row: 0,        // which row user is currently filling
    col: 0,        // column (position) inside that row
    tries: [],     // 2D array storing user's guesses
    rows: [],      // references to each .row in the HTML grid
    fruitBtns: [], // fruit keyboard buttons
    delBtn: null,  // delete button
    goBtn: null,   // enter button
    stop: false    // once win/lose happens → lock input
};

//Called when clicking "Level 1 / Level 2 / Level 3"
function startlevel(levelNum) {

    //If going home
    if (levelNum === 0) {
        showPage("Homepage");
        return;
    }

    //Show correct level page
    showPage("Level_" + levelNum);

    //now start the Fruidle game logic setup
    const info = LEVELS[levelNum];
    if (!info) return;

    //basic level settings
    game.level = levelNum;
    game.size = info.size;

    const page = document.getElementById("Level_" + levelNum);
    const grid = page.querySelector(".grid");
    const rows = grid.querySelectorAll(".row");

    game.rows = rows;
    game.maxTries = rows.length;

    //reset guess structure
    game.tries = [];
    for (let r = 0; r < game.maxTries; r++) {
        const rowArr = [];
        for (let c = 0; c < game.size; c++) {
            rowArr.push(null);
        }
        game.tries.push(rowArr);
    }

    game.row = 0;
    game.col = 0;
    game.stop = false;

    game.secret = makeSecret(info.pics, info.size);
    console.log("SECRET:", game.secret);

    clearGrid();

    //get buttons
    game.fruitBtns = page.querySelectorAll("button.fruit");
    game.delBtn = page.querySelector("button.del");
    game.goBtn = page.querySelector("button.go");

    enableButtons();

    //fruit buttons
    for (let i = 0; i < game.fruitBtns.length; i++) {
        let b = game.fruitBtns[i];
        b.onclick = function () {
            if (game.stop) return;
            let imgTag = b.querySelector("img");
            if (!imgTag) return;
            let src = imgTag.getAttribute("src");
            pickFruit(src);  
        };
    }

    //delete button
    if (game.delBtn) {
        game.delBtn.onclick = function () {
            if (!game.stop) removeFruit();
        };
    }

    //enter button
    if (game.goBtn) {
        game.goBtn.onclick = function () {
            if (!game.stop) submitRow();
        };
    }
}

//this creates a random fruit sequence for the answers (secret)
function makeSecret(list, size) {
    let arr = [];
    for (let i = 0; i < size; i++) {
        let r = Math.floor(Math.random() * list.length);
        arr.push(list[r]);
    }
    return arr;
}

//clears every cell in the grid (used before starting a new game)
function clearGrid() {
    for (let r = 0; r < game.rows.length; r++) {
        let cells = game.rows[r].querySelectorAll(".cell");
        for (let c = 0; c < cells.length; c++) {
            let cell = cells[c];
            cell.innerHTML = ""; //remove fruit image
            cell.classList.remove("tile-correct", "tile-present", "tile-absent");
        }
    }
}

//When a fruit button is clicked
function pickFruit(src) {
    //row already full → ignore
    if (game.col >= game.size) 
        return;

    let rowEl = game.rows[game.row];
    let cells = rowEl.querySelectorAll(".cell");

    //Put fruit image into cell
    cells[game.col].innerHTML = '<img src="' + src + '" class="tile-fruit">';

    //Record guess in the array
    game.tries[game.row][game.col] = src;

    game.col++; //move to next slot
}

// When delete button pressed, remove last fruit
function removeFruit() {
    if (game.col === 0) 
        return;
    game.col--;

    let rowEl = game.rows[game.row];
    let cells = rowEl.querySelectorAll(".cell");

    cells[game.col].innerHTML = "";        // erase image
    game.tries[game.row][game.col] = null; // erase stored value
}

//When user presses enter (submit guess)
function submitRow() {
    // Only allow submission if row is full
    if (game.col !== game.size) 
        return;

    let guess = game.tries[game.row].slice(); //copy guess
    let res = checkGuess(guess, game.secret); //result: ["correct","absent","present",...]

    paintRow(game.row, res); //color row tiles 

    //Check if all are green, then you win
    let win = res.every(v => v === "correct");

    if (win) {
        console.log("WIN!");
        lockButtons(); //freeze gameplay
        // Win popup would go here (not implemented in this version)
        return;
    }

    // Move to next row
    game.row++;
    game.col = 0;

    //if out of rows, then you lose
    if (game.row >= game.maxTries) {
        console.log("LOSE");
        lockButtons(); //freeze gameplay
        // Show lose popup
        showLosePopup();
    }
}

//Wordle-style scoring: green,yellow, and grey logic
//Prevents double yellow by marking used elements as null in second pass.
function checkGuess(guess, secret) {
    let size = secret.length;
    let res = new Array(size);
    let temp = secret.slice(); //clone so we can "use up" indexes

    //PASS 1:Mark greens first (correct spot)
    for (let i = 0; i < size; i++) {
        if (guess[i] === temp[i]) {
            res[i] = "correct";
            temp[i] = null; // prevent double count
        } else {
            res[i] = "absent"; //default until proven yellow
        }
    }

    //PASS 2: Mark yellows (correct fruit wrong spot)
    for (let i = 0; i < size; i++) {
        if (res[i] === "correct") 
            continue;

        let g = guess[i];
        let found = temp.indexOf(g);

        if (found !== -1) {
            res[i] = "present";
            temp[found] = null; //use it up
        }
    }
    return res;
}

//Paint colour classes onto tiles for a given row
function paintRow(r, res) {
    let rowEl = game.rows[r];
    let cells = rowEl.querySelectorAll(".cell");

    for (let i = 0; i < res.length; i++) {
        let c = cells[i];
        c.classList.remove("tile-correct", "tile-present", "tile-absent"); 

        if (res[i] === "correct") {
            c.classList.add("tile-correct");
        } else if (res[i] === "present") {
            c.classList.add("tile-present");
        } else {
            c.classList.add("tile-absent");
        }
    }
}

//Simple function to show lose popup
function showLosePopup() {
    losePopup.classList.add("active");
    // Prevent scrolling behind popup
    document.body.style.overflow = "hidden";
}

//When game ends, stop all interaction
function lockButtons() {
    game.stop = true;

    if (game.fruitBtns) {
        for (let i = 0; i < game.fruitBtns.length; i++) {
            game.fruitBtns[i].disabled = true;
        }
    }
    if (game.delBtn) game.delBtn.disabled = true;
    if (game.goBtn) game.goBtn.disabled = true;
}

//Used when starting level, turn everything back on
function enableButtons() {
    if (game.fruitBtns) {
        for (let i = 0; i < game.fruitBtns.length; i++) {
            game.fruitBtns[i].disabled = false;
        }
    }
    if (game.delBtn) game.delBtn.disabled = false;
    if (game.goBtn) game.goBtn.disabled = false;
}