


function toggleNav() {
    let side = document.getElementById("mySidenav");
    if(side.style.width === "0px"){
        side.style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        document.getElementById("openMenu").innerHTML = "Close"
    }else{
        side.style.width = "0px";
        document.getElementById("main").style.marginLeft = "0px";
        document.getElementById("openMenu").innerHTML = "Open"
    }
   
}