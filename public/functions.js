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

postJSON = {
    username: "fahad",
    descript: "Hello World again",
    id: "1738",
    title: "first post"
  }
  
  document.addEventListener("DOMContentLoaded", functionCall());
  function functionCall() {
    addMessageToChat(postJSON);
  }


function postMessageHTML(postJSON) {
    const username = postJSON.username;
    const title = postJSON.title
    const descript = postJSON.descript;
    const id = postJSON.id;
    let messageHTML = "<div  id='message_" + id + "' class='card'>\
        <div class='container'>\
          <h2><b>"+title+"</b></h4> \
          <h4>"+username+"</h4>\
          <p> "+descript+"</p> \
        </div>\
      </div>";
    return messageHTML;
  }
  
  function addMessageToChat(postJSON) {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML += postMessageHTML(postJSON);
    chatMessages.scrollIntoView(false);
    chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.clientHeight;
  }