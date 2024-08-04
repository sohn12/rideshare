function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function setUserCookie(userid, username, isDriver, days, isAdmin) {
  setCookie("userid", userid, days);
  setCookie("username", username, days);
  setCookie("isDriver", isDriver, days);
  setCookie("isAdmin", isAdmin, days);
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function getUserCookie() {
  const userid = getCookie("userid");
  const username = getCookie("username");
  const isDriver = getCookie("isDriver");
  const isAdmin = getCookie("isAdmin");
  return { userid, username, isDriver, isAdmin };
}

function logOut() {
  setCookie("username", "", -1);
  setCookie("userid", "", -1);
  setCookie("isDriver", "", -1);
  setCookie("isAdmin", "", -1);
  onLoad();
}

async function logIn(userId, isDriver, isAdmin) {
  try {
    const res = await fetch("/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        isDriver,
      }),
    });

    const data = await res.json();
    if (isDriver) {
      const user = data.driver;
      setUserCookie(user._id, user.name, true, 1, isAdmin);
    } else {
      const { user } = data;
      setUserCookie(user._id, user.name, false, 1, isAdmin);
    }
    onLoad();
  } catch (error) {}
}

function updateLocation() {
  const cookie = getUserCookie();
  if (cookie.isDriver) {
    window.location.href = "update-driver-location.html";
  } else {
    window.location.href = "update-user-location.html";
  }
}

function onLoad() {
  const cookie = getUserCookie();
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");
  if (cookie.userid) {
    if (
      window.location.href !== "http://localhost:5000/" &&
      window.location.href !== "http://localhost:5000/index.html"
    )
      window.location.href = "/index.html";
    loginButton.classList.add("d-none");
    logoutButton.classList.remove("d-none");
  } else {
    if (window.location.href !== "http://localhost:5000/login.html")
      window.location.href = "/login.html";
    loginButton.classList.remove("d-none");
    logoutButton.classList.add("d-none");
  }

  if (cookie.isDriver) {
    document.getElementById("findNearByDrivers").style.display = "none";
  }

  if (cookie.isAdmin === "true" || cookie.isAdmin === true) {
    document.getElementById("addDriver").style.display = "inline-block";
    document.getElementById("addUser").style.display = "inline-block";
  } else {
    document.getElementById("addDriver").style.display = "none";
    document.getElementById("addUser").style.display = "none";
  }
}

onLoad();
