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

function redirectCreateAuction() {
  window.location.href = "/public/create_auction.html"; // Replace with your desired URL
}

function redirectActiveAuctions() {
  window.location.href = "/public/active_listings.html"; // Replace with your desired URL
}

function redirectMyAuctions() {
  window.location.href = "/public/auction_page.html"; // Replace with your desired URL
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
      desc.innerHTML =
        "<strong>Description:</strong>\n" + auction_data["description"];
      owner.innerText += "Seller: " + auction_data["seller"];
      creation_date.innerText += " " + auction_data["creation_date"];
      price.innerText += " $" + amount + ", " + bidder;
    }
  };
  request.open("GET", get_url);
  request.send();
}

function welcome() {
  console.log("HELLO");
}
