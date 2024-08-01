// js/previous-trips.js
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
document.addEventListener("DOMContentLoaded", () => {
  fetchRides();
});

async function fetchRides() {
  try {
    const { userid, isDriver } = getUserCookie();
    console.log(userid);
    const response = await fetch("/api/v1/rides");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
    if (data.success) {
      populateTable(
        data.data.filter((r) =>
          isDriver ? r.driverId === userid : r.userId === userid
        )
      );
    } else {
      console.error("Failed to fetch rides:", data.error);
    }
  } catch (error) {
    console.error("Error fetching rides:", error);
  }
}

function populateTable(rides) {
  const tableBody = document.getElementById("tripsTableBody");
  tableBody.innerHTML = ""; // Clear any existing rows

  rides.forEach((ride) => {
    console.log(ride);
    // Check if the properties exist and are defined
    const pickupTime = ride.pickupTime
      ? new Date(ride.pickupTime).toLocaleString()
      : "N/A";
    const dropOffTime = ride.dropOffTime
      ? new Date(ride.dropOffTime).toLocaleString()
      : "N/A";
    const status = ride.status
      ? ride.status.charAt(0).toUpperCase() + ride.status.slice(1)
      : "N/A";

    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${ride.startLocation.formattedAddress || "N/A"}</td>
            <td>${ride.endLocation.formattedAddress || "N/A"}</td>
            <td>${pickupTime}</td>
            <td>${dropOffTime}</td>
            <td>${status}</td>
        `;

    tableBody.appendChild(row);
  });
}
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function logOut() {
  setCookie("username", "", -1);
  setCookie("userid", "", -1);
  setCookie("isDriver", "", -1);
  setCookie("isAdmin", "", -1);
  window.location.href = "/login.html";
  loginButton.classList.remove("d-none");
  logoutButton.classList.add("d-none");
}
