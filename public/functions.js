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

function simpleButton() {
  var prophecy = "";
  if (confirm("Choose the Prophecy")) {
    prophecy = "He was the Chosen One";
  }
  document.getElementById("paragraph").innerHTML = prophecy;
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

function redirectCreateAuction() {
  window.location.href = "/public/create_auction.html"; // Replace with your desired URL
}

function redirectActiveAuctions() {
  window.location.href = "/public/active_listings.html"; // Replace with your desired URL
}

function redirectMyAuctions() {
  window.location.href = "/public/auction_page.html"; // Replace with your desired URL
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
  chatMessages.innerHTML += postMessageHTML(messageJSON);
  chatMessages.scrollIntoView(false);
  chatMessages.scrollTop =
    chatMessages.scrollHeight - chatMessages.clientHeight;
}

function makePost() {
  const titleTextBox = document.getElementById("title-text-box");
  const descBox = document.getElementById("description-text-box");
  const title = titleTextBox.value;
  const description = descBox.value;

  titleTextBox.value = "";
  descBox.value = "";

  const request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log(this.response);
    }
  };
  const messageJSON = { title: title, description: description };
  request.open("POST", "/make-post");
  request.setRequestHeader("Content-Type", "application/json");
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
      // console.log(messages)
      // console.log(JSON.stringify(messages))
      for (const message of messages) {
        addMessageToChat(message);
      }
    }
  };
  request.open("GET", "/update-feed");
  request.send();
}

/*function welcome() {
  document.addEventListener("keypress", function (event) {
    if (event.code === "Enter") {
      makePost();
    }
  });

  document.getElementById("paragraph").innerHTML +=
    "<br/>This text was added by JavaScript 😀";
  document.getElementById("title-text-box").focus();
  document.getElementById("description-text-box").focus();

  updateFeed();
  setInterval(updateFeed, 2000);
}*/

function welcome() {
  /*document.addEventListener("keypress", function (event) {
      if (event.code === "Enter") {
          sendChat();
      }
  });*/


  //document.getElementById("paragraph").innerHTML += "<br/>This text was added by JavaScript 😀";
  //document.getElementById("chat-text-box").focus();

  updateAuctions();

  /*if (ws) {
      initWS();
  } else {
      const videoElem = document.getElementsByClassName('video-chat')[0];
      videoElem.parentElement.removeChild(videoElem);
      setInterval(updateChat, 2000);
  }*/

  // use this line to start your video without having to click a button. Helpful for debugging
  // startVideo();
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

function postMessageHTML(messageJSON) {
  let messageHTML = "";
  console.log(messageJSON);
  const username = messageJSON.user;
  const title = messageJSON.title;
  const descript = messageJSON.description;
  const id = messageJSON._id;
  let liked = null;
  let loggedUser = "";
  const likeNum = messageJSON.users_liked.length;

  const request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const userCheck = JSON.parse(this.response);
      loggedUser = userCheck["username"];
      console.log("current user: " + loggedUser);
      createMessageHTML();
    }
  };
  request.open("GET", "/user_check");
  request.send();

  function createMessageHTML() {
    if (messageJSON.users_liked.includes(loggedUser)) {
      liked = true;
      console.log(username + " already liked");
    } else {
      console.log(username + " has not liked");
      liked = false;
    }
    console.log(messageJSON.users_liked);

    if (liked == false) {
      messageHTML = `<div id='message_${id}' class='card'>\
          <div class='container'>\
            <h2><b>${title}</b></h4> \
            <h4>${username}</h4>\
            <p>${descript}</p> \
            <button id='likeBtn_${id}' onclick='likes("${id}")'>LIKE</button>\
            <p id='likes_${id}'>Number of Likes: ${likeNum}</p>\
          </div>\
        </div>`;
    } else {
      messageHTML = `<div id='message_${id}' class='card'>\
        <div class='container'>\
          <h2><b>${title}</b></h4> \
          <h4>${username}</h4>\
          <p>${descript}</p> \
          <button id='likeBtn_${id}' onclick='likes("${id}")'>UNLIKE</button>\
          <p id='likes_${id}'>Number of Likes: ${likeNum}</p>\
        </div>\
      </div>`;
    }

    // Insert the message HTML into the chat
    // For example:
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML += messageHTML;
    chatMessages.scrollIntoView(false);
    chatMessages.scrollTop =
      chatMessages.scrollHeight - chatMessages.clientHeight;
  }

  return messageHTML;
}

function likes(id) {
  const likeBtn = document.getElementById(`likeBtn_${id}`);
  const likesElement = document.getElementById(`likes_${id}`);
  let likes = parseInt(likesElement.innerText.split(":")[1]);
  if (likeBtn.innerText == "LIKE") {
    likes++;
    likeBtn.innerText = "UNLIKE";
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log(this.response);
      }
    };
    const messageJSON = { likeStatus: true, likeId: id };
    request.open("POST", "/like");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(messageJSON));
  } else {
    likes--;
    likeBtn.innerText = "LIKE";
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log(this.response);
      }
    };
    const messageJSON = { likeStatus: false, likeId: id };
    request.open("POST", "/unlike");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(messageJSON));
  }

  likesElement.innerText = `Number of Likes: ${likes}`;
}

function create_auction() {
  var form = document.getElementById('auctionForm');
  var formData_raw = new FormData(form);
  const request = new XMLHttpRequest();

  var item_title = formData_raw.get('item_title');
  var item_description = formData_raw.get('item_description');
  var item_image = formData_raw.get('item_image');
  var starting_price = formData_raw.get('starting_price');
  var auction_end_time = formData_raw.get('auction_end_time');

  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
            console.log(request.responseText);
    }
  };

  var form_data = {
    'item_title': item_title,
    'item_description': item_description,
    'item_image': item_image,
    'starting_price': starting_price,
    'auction_end_time': auction_end_time
  };

  request.open("POST", "/submit-auction");
  request.send(JSON.stringify(form_data));
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


////js for items page
//test data
item1 = {
  "time": 12,
  "name": "testItem",
  "desc": "this is a priceless artifact stolen back from the british meusum",
  "img": "public/CSE312TWITTER.png"

}

function load_items(){
  let cardContainer = document.getElementById("card-container");
  const request = new XMLHttpRequest();
  request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
          const items = JSON.parse(this.response);
          cardContainer.innerHTML = '';
          for (const item of items) {
            cardContainer.innerHTML += `\
            <div class="card">\
            <img src="${item["img"]}" alt="item"></img> \
              <div class="container">\
                <h4><b>${item["name"]}</b></h4>\
                <p>${item["desc"]}</p>\
                <button type="button" onclick="">Auction Page</button>
                </div>\
            </div>`
          }
      }
  }
  request.open("GET", "/items");
  request.send();


}

function inter(){
  setInterval(load_items, 2000);
}