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

updateAuctions();

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
      image.src = "public/" + auction_data["image_path"];
      desc.innerText = "Description:\n" + auction_data["description"];
      owner.innerText += "Seller: " + auction_data["seller"];
      creation_date.innerText += " " + auction_data["creation_date"];
      price.innerText += " $" + amount + ", " + bidder;

      // let auction_end_time =
      //   auction_data["creation_date"] + auction_data["length"] - Date.now();
      let auction_end_time = Date.now() + 3600000; //dummy data
      if (auction_end_time - Date.now() > 0) {
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
    " days " +
    convertedTime["hours"] +
    " hours " +
    convertedTime["minutes"] +
    " minutes and " +
    convertedTime["seconds"] +
    " seconds.";
  document.getElementById("time_left").innerText = text;
  setInterval(() => countdown(expiration), 1000);
}

function countdown(expiration) {
  // for specific auction page only, if you want to copy this logic, remove final line
  // let countdown = document.getElementById("time_left").innerText.split(" ");
  let timeLeft = expiration - Date.now();
  //console.log("Polling:", timeLeft);
  // let days = Number(countdown[0]) * 86400000;
  // let hours = Number(countdown[2]) * 3600000;
  // let minutes = Number(countdown[4]) * 60000;
  // let seconds = Number(countdown[6]) * 1000;

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
  } else if (Number(bid) < curr_highest) {
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
    } else if (request.readyState === 4) {
      // Handle response here (error)
      console.error(request.statusText);
    }
  };
  request.send(JSON.stringify(data));
}
