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
  
  function display_username() {
    const display = document.getElementById("display_name");
    let username = cookie_fetch("username");
    if (username) {
      display.innerHTML = display.innerText + `<strong> ${username} </strong>`;
    }
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
  
  // function chatMessageHTML(messageJSON) {
  //     const username = messageJSON.user;
  //     const message = messageJSON.title;
  //     const messageId = messageJSON.description;
  //     console.log(messageId)
  //     let messageHTML = "<br><button onclick='deleteMessage(\"" + messageId + "\")'>X</button> ";
  //     messageHTML += "<span id='message_" + messageId + "'><b>" + username + "</b>: " + message + "</span>";
  //     return messageHTML;
  // }
  
  function clearChat() {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = "";
  }
  
  function addMessageToChat(messageJSON) {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML += postAuctionHTML(messageJSON);
    chatMessages.scrollIntoView(false);
    chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.clientHeight;
  }
    
  function loadAuctionsWon() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        clearChat();
        const messages = JSON.parse(this.response);
        console.log(messages)
        console.log(JSON.stringify(messages))
        for (const message of messages) {
          addMessageToChat(message);
        }
      }
    };
    request.open("GET", "/loadAuctionsWon");
    request.send();
  }

  function loadAuctionsCreated() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        clearChat();
        const messages = JSON.parse(this.response);
        console.log(messages)
        console.log(JSON.stringify(messages))
        for (const message of messages) {
          addMessageToChat(message);
        }
      }
    };
    request.open("GET", "/loadAuctionsCreated");
    request.send();
  }
  
  function myAuctionsWon() {
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
  
    loadAuctionsWon();
    setInterval(loadAuctionsWon, 2000);
  }

  function myAuctionsCreated() {
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
  
    loadAuctionsCreated();
    setInterval(loadAuctionsCreated, 2000);
  }
  
  function postAuctionHTML(messageJSON) {
    let messageHTML = "";
    console.log(messageJSON);
    const owner = messageJSON.owner;
    const image = messageJSON.image_path;
    const item_name = messageJSON.item_name;
    const description = messageJSON.description;
    const price = messageJSON.current_price;
    const winner = messageJSON.winner;
    const id = messageJSON.id
    let loggedUser = "";
  
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const userCheck = JSON.parse(this.response);
        loggedUser = userCheck["username"];
        console.log("current user: " + loggedUser);
        loadAuctionHTML();
      }
    };
    request.open("GET", "/user_check");
    request.send();
  
    function loadAuctionHTML() {
      // <h1>${image}</p> \
        messageHTML = `<div id='message_${id}' class='card'>\
            <div class='container'>\
              <img src=${image} alt="It's CSE312 Twitter" class="auctImage"/>
              <h2><b>${item_name}</b></h4> \
              <h4>${owner}</h4>\
              <p>${description}</p> \
              <p>${price}</p> \
              <p>"winner: ${winner}"</p> \

            </div>\
          </div>`;
      // Insert the message HTML into the chat
      // For example:
      const chatMessages = document.getElementById("chat-messages");
      chatMessages.innerHTML += messageHTML;
      chatMessages.scrollIntoView(false);
      chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.clientHeight;
    }
    console.log(messageHTML)
    return messageHTML;
  }
  function redirectCreateAuction() {
    window.location.href = "https://notlocal.live/public/create_auction.html"; // Replace with your desired URL
  }
  
  function redirectActiveAuctions() {
    window.location.href = "https://notlocal.live/public/active_listings.html"; // Replace with your desired URL
  }
  
  function redirectMyAuctionsCreated() {
    window.location.href = "https://notlocal.live/auctionsCreated"; // Replace with your desired URL
  }
  function redirectMyAuctionsWon() {
    window.location.href = "https://notlocal.live/auctionsWon"; // Replace with your desired URL
  }
  
  function load_auction() {
    let url = new URL(window.location.href);
    let params = url.searchParams();
    let id = params.get("id");
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const auction_data = JSON.parse(this.responseText);
        const item_name = document.getElementById("item_header");
        const image = document
          .getElementById("auction_page_item")
          .getElementsByTagName("img");
        const desc = document.getElementById("item_info");
        const owner = document.getElementById("item_owner");
        item_name.innerText = auction_data["item_name"];
        image.src = auction_data["image_path"];
        desc.innerText = auction_data["description"];
        owner.innerText = auction_data["owner"];
      }
    };
    request.open("GET", "get-auction-data");
    request.send(JSON.stringify(id));
  }
  