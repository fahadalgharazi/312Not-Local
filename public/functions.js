function cookie_fetch(name) {
  let cookies = document.cookie.split("; "); // doc cookie returns {cookiename=cookie; cookiename2=cookie2; ...}
  for (let cookie of cookies) {
    let sc = cookie.split("=");
    if (sc[0].startsWith(name)) {
      return sc[1];
    }
  }
  return null;
}

function cookie() {
  visit = document.cookie;
  visVal = 0;
  console.log(visit);
  if ((document.cookie = "")) {
    visVal = 1;
  } else {
    getVisit = visit.split("=");
    visVal = parseInt(getVisit[1]);
  }
  document.getElementById("paragraph").innerHTML += visVal;
}

function chatMessageHTML(messageJSON) {
    const username = messageJSON.user;
    const message = messageJSON.title;
    const messageId = messageJSON.description;
    console.log(messageId)
    let messageHTML = "<br><button onclick='deleteMessage(\"" + messageId + "\")'>X</button> ";
    messageHTML += "<span id='message_" + messageId + "'><b>" + username + "</b>: " + message + "</span>";
    return messageHTML;
}

function clearChat() {
    const chatMessages = document.getElementById("feed");
    chatMessages.innerHTML = "";
}

function addMessageToChat(messageJSON) {
    const chatMessages = document.getElementById("feed");
    chatMessages.innerHTML += chatMessageHTML(messageJSON);
    chatMessages.scrollIntoView(false);
    chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.clientHeight;
}

function makePost() {
    const titleTextBox = document.getElementById("title-text-box");
    const descBox = document.getElementById("description-text-box")
    const title = titleTextBox.value;
    const description = descBox.value;
 
    titleTextBox.value = "";
    descBox.value = "";

    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.response);
        }
    }
    const messageJSON = {"title": title, "description": description};
    request.open("POST", "/make-post");
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(JSON.stringify(messageJSON));
    titleTextBox.focus();
    descBox.focus();
}

function updateFeed() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            clearChat();
            const messages = JSON.parse(this.response);
            console.log(messages)
            for (const message of messages) {
                addMessageToChat(message);
            }
        }
    }
    request.open("GET", "/update-feed");
    request.send();
}

function welcome() {
    document.addEventListener("keypress", function (event) {
        if (event.code === "Enter") {
            makePost();
        }
    });

    document.getElementById("paragraph").innerHTML += "<br/>This text was added by JavaScript 😀";
    document.getElementById("title-text-box").focus();
    document.getElementById("description-text-box").focus();

    updateFeed();
    setInterval(updateFeed, 2000);
}


function display_username() {
  const display = document.getElementById("display_name");
  let username = cookie_fetch("username");
  if (username) {
    display.innerHTML = display.innerText + `<strong> ${username} </strong>`;
  }
  document.addEventListener("keypress", function (event) {
    if (event.code === "Enter") {
        makePost();
        }
    });

    document.getElementById("title-text-box").focus();
    document.getElementById("description-text-box").focus();

    updateFeed();
    setInterval(updateFeed, 2000);
}
