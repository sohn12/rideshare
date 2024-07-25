mapboxgl.accessToken =
  "pk.eyJ1Ijoic29oYW4xMiIsImEiOiJjbHkzaW5lOHUwNDlrMnJvdnJkeXM0cWF1In0.bTfzAFfzb9JIK5iYVT-fBA";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 14,
  center: [0, 0],
});

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

async function getNearbyDrivers() {
  const userid = getCookie("userid");
  if(!userid) {
    alert("user not logged in");
    return;
  }

  const res = await fetch(`/api/v1/nearby-drivers/${userid}`);
  const data = await res.json();
  const { userLocation, nearbyDrivers } = data;
  const drivers = nearbyDrivers.map((driver) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          driver.location.coordinates[0],
          driver.location.coordinates[1],
        ],
      },
      properties: {
        driverId: driver.driverId,
        icon: "car",
      },
    };
  });

  loadMap(drivers, userLocation);
}

// Load map with drivers
function loadMap(drivers, location) {
  map.setCenter(location);
  //   map.setStyle("mapbox://styles/mapbox/streets-v12");
  map.on("load", function () {
    map.addLayer({
      id: "points",
      type: "symbol",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: drivers,
        },
      },
      layout: {
        "icon-image": "{icon}-15",
        "icon-size": 1.5,
        "text-field": "{driverId}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.9],
        "text-anchor": "top",
        "text-allow-overlap": true,
        "text-ignore-placement": true,
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
    });
    map.addSource("user", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: location,
            },
          },
        ],
      },
    });
    map.addLayer({
      id: "circle",
      type: "circle",
      source: "user",
      paint: {
        "circle-color": "#4264fb",
        "circle-radius": 8,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
      },
    });
  });
}

getNearbyDrivers();
