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

function chatMessageHTML(messageJSON) {
    const username = messageJSON.username;
    const message = messageJSON.message;
    const messageId = messageJSON.id;
    console.log(messageId)
    let messageHTML = "<br><button onclick='deleteMessage(\"" + messageId + "\")'>X</button> ";
    messageHTML += "<span id='message_" + messageId + "'><b>" + username + "</b>: " + message + "</span>";
    return messageHTML;
}

function clearChat() {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = "";
}

function addMessageToChat(messageJSON) {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML += chatMessageHTML(messageJSON);
    chatMessages.scrollIntoView(false);
    chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.clientHeight;
}

function makePost() {
    const chatTextBox = document.getElementById("chat-text-box");
    const descBox = document.getElementById("")
    const message = chatTextBox.value;
    const description = descBox.value;
    chatTextBox.value = "";
    descBox.value = "";

    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.response);
        }
    }
    const messageJSON = {"message": message, "description": description};
    request.open("POST", "/make-post");
    request.send(JSON.stringify(messageJSON));
    chatTextBox.focus();
}

function updateFeed() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            clearChat();
            const messages = JSON.parse(this.response);
            for (const message of messages) {
                addMessageToChat(message);
            }
        }
    }
    request.open("GET", "/chat-history");
    request.send();
}

function welcome() {
    document.addEventListener("keypress", function (event) {
        if (event.code === "Enter") {
            sendChat();
        }
    });

    document.getElementById("paragraph").innerHTML += "<br/>This text was added by JavaScript 😀";
    document.getElementById("chat-text-box").focus();

    updateFeed();
    setInterval(updateFeed, 2000);
}