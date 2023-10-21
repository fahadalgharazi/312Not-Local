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
  const display = document.getElementById("display_name");
  let username = cookie_fetch("username");
  if (username) {
    display.innerHTML = display.innerText + `<strong> ${username} </strong>`;
  }
}
