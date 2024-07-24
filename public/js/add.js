const driverForm = document.getElementById('driver-form');
const driverId = document.getElementById('driver-id');
const driverAddress = document.getElementById('driver-address');
const driverName = document.getElementById('driver-name');

// Send POST to API to add driver
async function addDriver(e) {
  e.preventDefault();

  if (driverId.value === '' || driverName.value === '' || driverAddress.value === '') {
    alert('Please fill in fields');
  }

  const sendBody = {
    driverId: driverId.value,
    driverName: driverName.value,
    address: driverAddress.value
  };

  try {
    const res = await fetch('/api/v1/drivers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendBody)
    });

    if (res.status === 400) {
      throw Error('Driver already exists!');
    }

    alert('Driver added!');
    window.location.href = '/index.html';
  } catch (err) {
    alert(err);
    return;
  }
}

driverForm.addEventListener('submit', addDriver);
