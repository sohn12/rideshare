const userForm = document.getElementById("driver-form");
const userId = document.getElementById("user-id");
const driverId = document.getElementById("driver-id");
const userIdSelect = document.getElementById("user-id");
const driverIdSelect = document.getElementById("driver-id");
const tripId = document.getElementById("trip-id");
const startLocation = document.getElementById("start-location");
const endLocation = document.getElementById("end-location");
//const tripStatus = document.getElementById("status");

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

function onLoad() {
  const isAdmin = getCookie("isAdmin");
  if(isAdmin) {
    fetchDrivers();
    fetchUsers();
    return;
  }
  const isDriver = getCookie("isDriver");
  if(isDriver) {
    document.getElementById("driver").style.display = "none";
    fetchUsers();
  }
  else {
    document.getElementById("user").style.display = "none";
    fetchDrivers();
  }
}

async function fetchUsers() {
  try {
    const res = await fetch("/api/v1/users");
    const users = await res.json();
    userIdSelect.innerHTML = '<option value="">Select User</option>';
    users.data.forEach((user) => {
      const option = document.createElement("option");
      option.value = user._id;
      option.textContent = user.name;
      userIdSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error fetching users:", err);
  }
}

async function fetchDrivers() {
  try {
    const res = await fetch("/api/v1/drivers");
    const drivers = await res.json();
    driverIdSelect.innerHTML = '<option value="">Select Driver</option>';
    drivers.data.forEach((driver) => {
      const option = document.createElement("option");
      option.value = driver._id;
      option.textContent = driver.driverName;
      driverIdSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error fetching drivers:", err);
  }
}

// Send POST to API to add user
async function addTrip(e) {
  e.preventDefault();

  const isAdmin = getCookie("isAdmin");
  const isDriver = getCookie("isDriver");

  if((isAdmin && userId.value=== "") || (!isAdmin && isDriver && userId.value === "")) {
    alert("please fill in User Id");
    return;
  }

  if((isAdmin && driverId.value=== "") || (!isAdmin && !isDriver && driverId.value === "")) {
    alert("please fill in Driver Id");
    return;
  }

  if(tripId.value === "" || startLocation.value === "" || endLocation.value === "") {
    alert("please fill in all fields");
    return;
  }

  let selectedUserId = userId.value;
  let selectedDriverId = driverId.value;

  userIdFromCookie = getCookie("userid");

  if(!isAdmin && isDriver) {
    selectedDriverId = userIdFromCookie;
  }
  else if(!isAdmin && !isDriver){
    selectedUserId = userIdFromCookie;
  }

  const sendBody = {
    userId: selectedUserId,
    driverId: selectedDriverId,
    tripId: tripId.value,
    startAddress: startLocation.value,
    endAddress: endLocation.value,
    //status: tripStatus.value,
  };

  try {
    const res = await fetch("/api/v1/rides", {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendBody),
    });

    if (res.status === 400) {
      throw Error("Ride already exists!");
    }

    if (res.status === 200) {
      alert("Trip added!");
    }

    window.location.href = "/index.html";
  } catch (err) {
    alert(err);
    return;
  }
}

userForm.addEventListener("submit", addTrip);
document.addEventListener("DOMContentLoaded", onLoad);
