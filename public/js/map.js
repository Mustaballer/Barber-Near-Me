mapboxgl.accessToken ='pk.eyJ1IjoibXVzMjAwMy1hYmR1bCIsImEiOiJjazh0aHZwYWwwMDlqM250MXNseXhzOTZqIn0.wn4nYNkApTXegqQ0nb2gZQ';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
zoom: 3,
center: [-96, 37.8]
});

// Fetch stores from api
async function getStores() {
  const res = await fetch('/api/v1/stores');
  const data = await res.json();

  const stores = data.data.map(store => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [store.location.coordinates[0], store.location.coordinates[1]]
      },
      properties: {
        storeId: store.storeId,
        icon: 'square'
      }
    }
  });
  loadMap(stores);
}


// Load map with stores
function loadMap(stores) {
  map.on('load', function() {
    map.loadImage('https://cdn0.iconfinder.com/data/icons/black-logistics-icons/256/Barbershop.png', function(error, image) {
      if (error) throw error;
      map.addImage('cat', image);
      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: stores
          }
        },
        layout: {
          'icon-image': 'cat',
          'icon-size': 0.1,
          'text-field': '{storeId}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.9],
          'text-anchor': 'top'
        }
      });
    });
  });
}

getStores();
