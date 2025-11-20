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
    if (level===0){
        showPage("Homepage")
    }
    else{
        showPage("Level_"+level);
    }
}

/**
 * This function for swithcing between visible pages
 */
function showPage(pageID){
    //Hide pages
    document.querySelectorAll(".page").forEach(page =>{
        page.classList.remove("active");
    } );
    //Show page
    document.getElementById(pageID).classList.add("active");
    // Makes sure new page scrolls to top.
    window.scrollTo(0, 0);
}



   

