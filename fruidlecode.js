let intervalID = null;
window.onload=function(){
    //load the homepage first

    // Check if there is a saved page in URL first
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash);

        // Wait for DOM to load, then start timer
        setTimeout(() => {
            if(hash.startsWith('Level_')) {
                timer();
            }
        }, 100);

    } else {
        // If no saved page load homepage
        innitGame();
    }
    

    //get all help buttons
    const helpButtons=document.querySelectorAll(".help");
    const modal= document.getElementById("HowToPlayModal");
    const closeButton=document.getElementById("closeHowToPlay");

    helpButtons.forEach(button=>{
        button.onclick=()=>{
             modal.style.display="flex";
             // Prevent scrolling behind pop-up
             this.document.body.style.overflow = "hidden";
        };
    });

    closeButton.onclick=()=>{
        modal.style.display="none";
        // Scrolling returns once pop-up is closed.
        document.body.style.overflow = "auto";
    };

    window.onclick = (e) =>{
        if(e.target===modal){
            modal.style.display = "none";
            // Scrolling returns once pop-up is closed.
            document.body.style.overflow = "auto";
        }
    };
}
function innitGame() {
    //homepage
    showPage("Homepage")
}

function startlevel(level) {
    if (intervalID) {
        clearInterval(intervalID);
        intervalID = null;
    }
    if (level===0){
        showPage("Homepage");
    }
    else{
        showPage("Level_"+level);
        // Start timer immediately for navigation purposes.
        setTimeout(() =>timer(), 50);
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
    
    // Makes sure refresh stays on current page.
    window.location.hash = pageID;

    // Makes sure new page scrolls to top.
    window.scrollTo(0, 0);
}

function timer() {
    const activePage = document.querySelector('.page.active');
    if (!activePage) {
        console.log("No active page found");
        return;
    }
    
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