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

function sendChat() {
    const titleTextBox = document.getElementById("title-text-box");
    const message = titleTextBox.value;
    titleTextBox.value = "";
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.response);
        }
    }
    const messageJSON = {"message": message};
    request.open("POST", "/chat-message");
    request.send(JSON.stringify(messageJSON));
    titleTextBox.focus();
}


