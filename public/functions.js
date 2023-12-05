// const { verify } = require("jsonwebtoken");

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

function num_check(str) {
  // uses regex to check that str is a number
  return /^\d+$/.test(str);
}

function display_username() {
  const display = document.getElementById("display_name");
  let username = cookie_fetch("username");
  if (username) {
    display.innerHTML = display.innerText + `<strong> ${username} </strong>`;
  }
}

function redirectCreateAuction() {
  window.location.href = "/public/create_auction.html"; // Replace with your desired URL
}

function redirectActiveAuctions() {
  window.location.href = "/public/active_listings.html"; // Replace with your desired URL
}

function redirectMyAuctionsCreated() {
  window.location.href = "/auctionsCreated"; // Replace with your desired URL
}
function redirectMyAuctionsWon() {
  window.location.href = "/auctionsWon"; // Replace with your desired URL
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

  updateFeed();
  setInterval(updateFeed, 2000);
}

async function display_auction() {
  // get id from url
  let url = window.location.search;
  const urlParams = new URLSearchParams(url);
  const id = urlParams.get("id");
  const get_url = "/get-auction-data?id=" + id;
  const request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      //console.log("Response " + request.responseText + " received from id");
      const auction_data = JSON.parse(this.responseText);
      const item_name = document.getElementById("item_header");
      const image = document
        .getElementById("auction_page_item")
        .getElementsByTagName("img")[0];
      //console.log("Image!", image);
      const desc = document.getElementById("desc");
      const owner = document.getElementById("item_owner");
      let creation_date = document.getElementById("item_creation_date");
      let bid_div = document.getElementById("bid");
      let price = bid_div.getElementsByTagName("h2")[0];

      let curr_bid = auction_data["current_bid"];
      let bidder = curr_bid[0];
      let amount = curr_bid[1];
      item_name.innerText = auction_data["item_name"];
      image.src = "public/images/" + auction_data["image_path"];
      desc.innerText = "Description:\n" + auction_data["description"];
      owner.innerText += "Seller: " + auction_data["seller"];
      creation_date.innerText += " " + auction_data["creation_date"];
      price.innerText += " $" + amount + ", " + bidder;
      creation_date = new Date(auction_data["creation_date"]).getTime();
      let length = new Date(auction_data["length"]).getTime();
      let auction_end_time = creation_date + length;
      console.log("AUCTION END TIME", auction_end_time);
      if (auction_end_time > 0) {
        init_countdown(auction_end_time);
      } else {
        document.getElementById("time_left").innerText = "";
        document.getElementById("time_left_prompt").innerText = "Auction over!";
      }
    }
  };
  request.open("GET", get_url);
  request.send();
}

function init_countdown(expiration) {
  let timeLeft = expiration - Date.now();
  console.log("Time left:", timeLeft);
  let convertedTime = convertMS(timeLeft);
  console.log("Converted time", convertedTime);
  let text =
    convertedTime["days"] +
    " days, " +
    convertedTime["hours"] +
    " hours, " +
    convertedTime["minutes"] +
    " minutes and, " +
    convertedTime["seconds"] +
    " seconds.";
  document.getElementById("time_left").innerText = text;
  setInterval(() => countdown(expiration - Date.now()), 1000);
}

function countdown(expiration) {
  // for specific auction page only, if you want to copy this logic, remove final
  // let countdown = document.getElementById("time_left").innerText.split(" ");
  let timeLeft = expiration;

  if (timeLeft < 0) {
    document.getElementById("time_left").innerText = "";
    document.getElementById("time_left_prompt").innerText = "Auction over!";
    return;
  }

  console.log("TIMELEFT IN COUNTDOWN", timeLeft);

  let convertedTime = convertMS(timeLeft);
  let text =
    convertedTime["days"] +
    " days, " +
    convertedTime["hours"] +
    " hours, " +
    convertedTime["minutes"] +
    " minutes and " +
    convertedTime["seconds"] +
    " seconds.";
  document.getElementById("time_left").innerText = text;
}

function convertMS(ms) {
  // ms -> d/h/m/s
  console.log("MS", ms);
  let days = Math.floor(ms / 86400000); // total days
  let hours = Math.floor((ms % 86400000) / 3600000); // remaining hours
  let minutes = Math.floor((ms % 3600000) / 60000); // remaining minutes
  let seconds = Math.floor((ms % 60000) / 1000); // remaining seconds

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

function welcome() {
  verification();
  console.log("HELLO");
}

async function send_data_and_update() {
  let user = await cookie_fetch("username");
  let bid = document.getElementById("input2").value;
  let url = window.location.search;
  let urlParams = new URLSearchParams(url);
  let id = urlParams.get("id");
  let display_bid = document.getElementById("display_bid");
  console.log("Displaybid", display_bid.innerText);
  let curr_highest = Number(
    display_bid.innerText.split(",")[0].split(" ")[2].split("$")[1]
  ); //Highest Bid: $amount, user
  console.log("currhighest", curr_highest);
  let data = {
    user: user,
    bid: bid,
    id: id,
  };

  let error = document.getElementById("error_form");
  if (!user || !bid) {
    error.innerText = "Error, not signed in or empty field";
    return;
  } else if (Number(bid) <= curr_highest) {
    document.getElementById("error_form").innerText =
      "Error, enter a number higher than current bid.";
    return;
  } else if (num_check(bid) == false) {
    error.innerText = "Error, please enter a number";
    return;
  }

  let request = new XMLHttpRequest();
  request.open("POST", "/new-bid");
  request.setRequestHeader("Content-Type", "application/json");
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      // Handle response here (success)
      document.getElementById("input2").innerText = "";
      document.getElementById("error_form").innerText =
        "Successfully bid $" + bid + "!";
      location.reload();
    } else if (request.readyState === 4) {
      // Handle response here (error)
      console.error(request.statusText);
    }
  };
  request.send(JSON.stringify(data));
}

////js for items page
//test data
item1 = {
  time: 12,
  name: "testItem",
  desc: "this is a priceless artifact stolen back from the british meusum",
  img: "public/CSE312TWITTER.png",
};

function load_items() {
  let cardContainer = document.getElementById("card-container");
  const request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const items = JSON.parse(this.response);
      cardContainer.innerHTML = "";
      for (const item of items) {
        img = "images/" + item["image_path"];
        cardContainer.innerHTML += `\
            <div class="card">\
            <img src="${img}" alt="item" style="width:275px;height:275px"></img> \
              <div class="container">\
                <h4><b>${item["item_name"]}</b></h4>\
                <h5><b>${item["current_bid"]}</b></h5>\
                <p>${item["description"]}</p>\
                <button type="button" onclick="itemRedirct('${item["id"]}')">Auction Page</button>
                </div>\
            </div>`;
      }
    }
  };
  request.open("GET", "/items");
  request.send();
}
function verification() {
  let veri = document.getElementById("Verification");
  const request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const ver = this.response;
      veri.innerHTML = "" + ver;
    }
  };
  request.open("GET", "/verify");
  request.send();
}
function itemRedirct(id) {
  window.location.href = "/auction-page?id=" + id; // Replace with your desired URL
}

// const form = document.getElementById("form");
// form.addEventListener("submit", (event) => {
//   event.preventDefault(); // prevents default submission
//   let form = document.getElementById("auctionForm");
//   let formData = new FormData(form);
//   console.log("FORM");
//   const request = new XMLHttpRequest();
//   request.onreadystatechange = function () {
//     if (request.readyState === 4) {
//       console.log(request.responseText);
//       if (request.status === 200) {
//         console.log("Redirecting");
//         console.log("RESP", request.responseText);
//         setTimeout(null, 1000);
//         itemRedirct(request.responseText);
//       } else {
//         console.log("error with creating auction.");
//       }
//     }
//   };

//   request.open("POST", "/submit-auction");
//   request.send(formData); // Send the FormData object
// });

function inter() {
  setInterval(load_items, 2000);
}

async function myAuctions() {
  let chatMessagesDiv = document.getElementById("chat-messages");
  const request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const auctions = JSON.parse(this.response);
      chatMessagesDiv.innerHTML = ""; // Clear previous content
      auctions.forEach((auction) => {
        console.log(auction);
        let auctionDiv = document.createElement("div");
        auctionDiv.classList.add("auction");

        let title = document.createElement("h3");
        title.textContent = "Name: " + auction.item_name;

        let description = document.createElement("p");
        description.textContent = "Desc: " + auction.description;
        // redir
        let button = document.createElement("button");
        button.textContent = "View Auction";
        button.onclick = () => {
          itemRedirct(auction.id);
        };
        // create the auction
        auctionDiv.appendChild(title);
        auctionDiv.appendChild(description);
        auctionDiv.appendChild(button);
        chatMessagesDiv.appendChild(auctionDiv);
      });
    } else if (this.readyState === 4) {
      console.error("err", error);
    }
  };
  request.open("GET", "/loadAuctionsCreated");
  request.send();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname == "/auctionsCreated") {
    await put_listings(false);
  } else if (window.location.pathname == "/auctionsWon") {
    await put_listings(true);
  }
});

async function put_listings(won) {
  let listings;
  document.getElementById("paragraph").innerText +=
    " " + cookie_fetch("username");
  try {
    const response = await fetch(
      won ? "/loadAuctionsWon" : "/loadAuctionsCreated"
    );
    if (!response.ok) {
      throw new Error("Error with server.");
    }
    listings = await response.json();
    console.log("data", listings);
  } catch (error) {
    console.log("ERROR", error);
    return;
  }

  console.log("listings", listings);
  await listing_loop(listings);
}

async function listing_loop(listings) {
  let id = 1;
  let listings_html = document.getElementById("listings");
  for (let [key, value] in Object.entries(listings)) {
    console.log("key", key);
    console.log("value", value);
    let item = listings[key];
    let div = document.createElement("div");
    div.id = "item-" + id;
    let item_name = item["item_name"];
    console.log(item_name);
    let desc = item["description"];
    console.log(desc);
    let item_id = item["id"];

    div.innerHTML = `Item name: ${item_name}</br>Desc: ${desc} `;

    let button = document.createElement("button");
    button.innerHTML = "To Auction";
    button.onclick = async () => {
      var host = window.location.protocol + "//" + window.location.host;
      window.location.href = host + "/auction-page?id=" + item_id;
    };
    div.appendChild(button);
    listings_html.appendChild(div);
    id += 1;
  }
}
