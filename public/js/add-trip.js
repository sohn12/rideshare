const userForm = document.getElementById("driver-form");
const userId = document.getElementById("user-id");
const driverId = document.getElementById("driver-id");
const userIdSelect = document.getElementById("user-id");
const driverIdSelect = document.getElementById("driver-id");
const tripId = document.getElementById("trip-id");
const startLocation = document.getElementById("start-location");
const endLocation = document.getElementById("end-location");
const tripStatus = document.getElementById("status");

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

  if (
    userId.value === "" ||
    driverId.value === "" ||
    tripId.value === "" ||
    startLocation.value === "" ||
    endLocation.value === "" ||
    tripStatus.value === ""
  ) {
    alert("Please fill in fields");
  }

  const sendBody = {
    userId: userId.value,
    driverId: driverId.value,
    tripId: tripId.value,
    startAddress: startLocation.value,
    endAddress: endLocation.value,
    status: tripStatus.value,
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
      throw Error("User already exists!");
    }

    alert("Trip added!");
    window.location.href = "/index.html";
  } catch (err) {
    alert(err);
    return;
  }
}

userForm.addEventListener("submit", addTrip);
document.addEventListener("DOMContentLoaded", () => {
  fetchUsers();
  fetchDrivers();
});
