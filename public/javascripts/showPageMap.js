// |----------------| Required Libraries |---------------| //
maptilersdk.config.apiKey = maptilerApiKey;
// |----------------| Required Libraries |---------------| //

// |----------------| Maptiler Functions |---------------| //
// === Maptiler map style function === //
const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

// === Maptiler map marker and popup function === //
new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h5>${campground.title}</h5><p>${campground.location}</p>`
            )
    )
    .addTo(map)
// |----------------| Maptiler Functions |---------------| //