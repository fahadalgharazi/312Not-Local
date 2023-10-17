function simpleButton(){
    var prophecy = ""
    if (confirm("Choose the Prophecy")){
        prophecy = "He was the Chosen One"
    }
    document.getElementById("paragraph").innerHTML = prophecy;
}

function cookie(){
    visit = document.cookie
    visVal = 0;
    console.log(visit)
    if (document.cookie = "") {
        visVal = 1
    }
    else {
        getVisit = visit.split('=')
        visVal = parseInt(getVisit[1])
    }
    document.getElementById("paragraph").innerHTML += visVal;
}