
//Create an initial map object
// Set the longitude, latitude, and the starting zoom level
let myMap = L.map("map").setView([45.52, -122.67], 3);

// Add a tile layer (the background map image) to our map
// Use the addTo method to add objects to our map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    function style (feature){
    return {
    fillColor:color(feature.geometry.coordinates[2]),
    radius:radius(feature.properties.mag),
    fillOpacity:1,
    color:"#000000"
    }
    };

    function color (depth){
    if(depth > 90){return "#d73027";}
    if(depth > 70){return "#fc8d59";}
    if(depth > 50){return "#fee08b";}
    if(depth > 30){return "#d9ef8b";}
    if(depth > 10){return "#91cf60";}
    return "#1a9850"
    };

    function radius (magnitude){
    return magnitude * 4;
    };

 L.geoJson(data, {
    onEachFeature: function (feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  },
  style:style,
  pointToLayer: function (feature,latlng){return L.circleMarker(latlng)}

  }).addTo(myMap);
// Define legend colors and grades
    let grades = [0, 10, 30, 50, 70, 90];
    let colors = ["#1a9850", "#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"];

    // Create a legend control
    let legend = L.control({ position: 'bottomright' });

    // Add legend to map
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let labels = [];

        // Loop through grades to generate legend labels
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

});