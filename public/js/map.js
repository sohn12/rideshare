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
  const res = await fetch('/api/v1/drivers');
  const data = await res.json();
  const location = JSON.parse(getCookie("location"));
  const drivers = data.data.map(driver => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          driver.location.coordinates[0],
          driver.location.coordinates[1]
        ]
      },
      properties: {
        driverId: driver.driverId,
        icon: 'car'
      }
    };
  });

  loadMap(drivers, location.coordinates);
}

// Load map with drivers
function loadMap(drivers, location) {
  map.setCenter(location);
  map.on('load', function() {
    map.addLayer({
      id: 'points',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: drivers
        }
      },
      layout: {
        'icon-image': '{icon}-15',
        'icon-size': 1.5,
        'text-field': '{driverId}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.9],
        'text-anchor': 'top'
      }
    });
  });
}

getDrivers();
