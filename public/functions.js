function simpleButton() {
  var prophecy = "";
  if (confirm("Choose the Prophecy")) {
    prophecy = "He was the Chosen One";
  }
  document.getElementById("paragraph").innerHTML = prophecy;
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

function display_username() {
  const display = document.getElementsByClassName("display_name");
  const cookies = document.cookie;
  const split_cookies = cookies.split(";");
  const token_exists = split_cookies.some((cookie) =>
    cookie.startsWith("token_cookie")
  ); // returns true c meets the condition
  if (token_exists) {
    console.log(token_exists);
    fetch("localhost:8080/user_check")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
      })
      .then((data) => {
        console.log("Data:" + data);
        display.innerText = display.innerText + String(data);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }
}
