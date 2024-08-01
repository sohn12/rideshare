const userForm = document.getElementById("driver-form");
const userId = document.getElementById("user-id");
const driverId = document.getElementById("driver-id");
const tripId = document.getElementById("trip-id");
const startLocation = document.getElementById("start-location");
const endLocation = document.getElementById("end-location");
const tripStatus = document.getElementById("status");

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
