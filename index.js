// // creating a map - (создание карты)
var map = L.map('map').setView([51.5, 7.6], 9);

//connecting OpenStreetMap layer - (подключение слоя OpenStreetMap)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

//display of the border of the Federal State of NRW - (отображение границы федеральной земли Северный Рейн-Вестфалия)

fetch('https://nominatim.openstreetmap.org/search.php?q=NRW&polygon_geojson=1&format=geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    L.geoJSON(json, {
      weight: 5,
      color: '#39c',
      opacity: 1,
      fillOpacity: 0,
    }).addTo(map);
  });

//create custom icon -(создание пользовательского значка)
const gritIcon = L.icon({
  iconUrl: './images/grit.svg',
  iconSize: [40, 60],
  iconAnchor: [15, 45],
  popupAnchor: [0, -45],
});

// Locations and their information
const locations = [
  {
    coords: [51.667222499999994, 7.608633284955791], // Werne
    address: 'Landwehrstraße 143, 59368 Werne',
  },
  {
    coords: [51.02698185, 7.837748123596256], // Olpe
    address: 'Königsberger Straße 22, 57462 Olpe',
  },
];

// Add markers with custom icons
locations.forEach((location) => {
  L.marker(location.coords, { icon: gritIcon }).addTo(map).bindPopup(`<b>${location.address}</b>`);
});
