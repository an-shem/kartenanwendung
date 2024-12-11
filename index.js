// // creating a map - (создание карты)
var map = L.map('map', { zoomControl: false }).setView([51.5, 7.6], 9);

// creating a controller to control zoom - (создание контроллера для управления зумом)
L.control.zoom({ position: 'topright' }).addTo(map);

// ----------------------------------------------------------------------------------------

//connecting OpenStreetMap layer - (подключение слоя OpenStreetMap)
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

//adding new base maps - (добавление новых базовых карт)

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

var Esri_NatGeoWorldMap = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
  {
    attribution:
      'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    maxZoom: 16,
  }
);

var GeoportailFrance_orthos = L.tileLayer(
  'https://data.geopf.fr/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
  {
    attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
    bounds: [
      [-75, -180],
      [81, 180],
    ],
    minZoom: 2,
    maxZoom: 19,
    format: 'image/jpeg',
    style: 'normal',
  }
);

// ----------------------------------------------------------------------------------------

//create custom icon -(создание пользовательского маркера для карты)
var gritIcon = L.icon({
  iconUrl: './images/grit.svg',
  iconSize: [35, 55],
  iconAnchor: [20, 45],
  popupAnchor: [0, -45],
});

// coordinates and addresses for points on the map - (координаты и  адреса для точек на карте)
var locations = [
  {
    coords: [51.667222499999994, 7.608633284955791], // Werne
    address: 'Landwehrstraße 143, 59368 Werne',
  },
  {
    coords: [51.02698185, 7.837748123596256], // Olpe
    address: 'Königsberger Straße 22, 57462 Olpe',
  },
];

var gritArreyMarkers = [];

// create markers with custom icons - (создавать маркеры с пользовательскими значками)
locations.forEach((location) => {
  gritArreyMarkers.push(L.marker(location.coords, { icon: gritIcon }).bindPopup(`<b>${location.address}</b>`));
});

// add markers to the map - (добавляем маркеры на карту)
var gritMarkers = L.layerGroup(gritArreyMarkers).addTo(map);

// ----------------------------------------------------------------------------------------

// add layer management on the map - (добавляем управление слоями на карте)
var baseMaps = {
  OpenStreetMap: osm,
  OpenTopoMap,
  Esri_NatGeoWorldMap,
  GeoportailFrance_orthos,
};

var overlayMaps = {
  grit: gritMarkers,
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// ----------------------------------------------------------------------------------------

//display of the border of the Federal State of NRW - (отображение границы федеральной земли Северный Рейн-Вестфалия)

fetch('https://nominatim.openstreetmap.org/search.php?q=NRW&polygon_geojson=1&format=geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    var geojsonNRW = L.geoJSON(json, {
      weight: 5,
      color: '#39c',
      opacity: 1,
      fillOpacity: 0,
    }).addTo(map);
    layerControl.addOverlay(geojsonNRW, 'NRW');
  });

// ---------------------------------------------------------------------------------------------
//display scale - (отображение масштаба)
L.control.scale({ imperial: false, position: 'bottomright' }).addTo(map);
// --------------------------------------------------------------------------------------------
//indication of coordinates when clicking on the map -(указание координат при нажатии на карту)
var popup = L.popup();
function onMapClick(e) {
  popup.setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(map);
}
map.on('click', onMapClick);
