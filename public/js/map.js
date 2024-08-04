mapboxgl.accessToken =
  'pk.eyJ1Ijoic29oYW4xMiIsImEiOiJjbHkzaW5lOHUwNDlrMnJvdnJkeXM0cWF1In0.bTfzAFfzb9JIK5iYVT-fBA';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 14,
  center: [-97.33362, 27.6966]
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


async function getDrivers() {
  const location = JSON.parse(getCookie("location"));
  loadMap(location.coordinates);
}

// Load map with drivers
function loadMap(location) {
  map.setCenter(location);
  map.on("load", function() {
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

getDrivers();
