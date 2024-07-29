const userLocationForm = document.getElementById('update-user-location-form');
const userLocation = document.getElementById('user-location');

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

// sends  a put request to update the user location in database
async function updateUserLocation (e) {
    e.preventDefault();
    const address = userLocation.value;
    console.log(address);
    if(address == '' || address == null) {
        alert("please fill the user location");
    }

    const userid = getCookie("userid");
    if(!userid) {
        alert("user not logged in");
        return;
    }

    try {
        res = await fetch(`/api/v1/users/${userid}/updateLocation`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({address})
        });
        if(res.status == 200) {
            alert('User location updated!');
            window.location.href = '/index.html';
        }
    }
    catch (err) {
        alert(err);
        return;
    }

};


userLocationForm.addEventListener('submit', updateUserLocation);