let intervalID = null;
window.onload=function(){
    //load the homepage first
    innitGame();

    //get all help buttons
    const helpButtons=document.querySelectorAll(".help");
    const modal= document.getElementById("HowToPlayModal");
    const closeButton=document.getElementById("closeHowToPlay");

    helpButtons.forEach(button=>{
        button.onclick=()=>{
             modal.style.display="flex";
        };
    });

    closeButton.onclick=()=>{
        modal.style.display="none";
    };

    window.onclick = (e) =>{
        if(e.target===modal){
            modal.style.display = "none";
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
        timer();
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
    // Makes sure new page scrolls to top.
    window.scrollTo(0, 0);
}
function timer(){
 const output=document.querySelector(".page.active .timer");
 let count=0;
 let mcount=0;
 if(intervalID){
        clearInterval(intervalID);
        intervalID=null;
     }
 const result=document.getElementById("result")
 intervalID=setInterval(()=>{
     count++;
     if(count==60){
        mcount++;
        count=0;
    }
    output.innerText=`${mcount.toString().padStart(2,'0')}:${count.toString().padStart(2,'0')}`;
    if(mcount==3){
        result.innerText="Time:00:00";
        clearInterval(intervalID);
        output.innerText="Time's up";
    }
},1000);
}