
document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize Leaflet Map
    // We start centered on the general region
    const map = L.map('map', {
        scrollWheelZoom: false, // Prevent scrolling page from zooming map
        zoomControl: false // We'll add it in a custom position if needed, or keep minimal
    }).setView([29.5, 83.5], 7);

    // 2. Add Tile Layer (CartoDB Voyager - Clean, modern, "Himalayan" friendly colors)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // 3. Define Route Data (Coordinates: Lat, Long)
    const locations = {
        kathmandu:   { coords: [27.7172, 85.3240], zoom: 11, title: "Kathmandu (1,400m)" },
        kyirong:     { coords: [28.3967, 85.3333], zoom: 10, title: "Kyirong Border (2,800m)" },
        saga:        { coords: [29.3300, 85.2333], zoom: 9,  title: "Saga" },
        manasarovar: { coords: [30.6700, 81.4700], zoom: 10, title: "Lake Manasarovar (4,590m)" },
        darchen:     { coords: [30.9700, 81.2800], zoom: 11, title: "Darchen Base Camp" },
        kailash:     { coords: [31.0674, 81.3119], zoom: 12, title: "Mount Kailash (6,638m)" },
        return:      { coords: [29.5000, 83.5000], zoom: 7,  title: "Return Journey" },
        departure:   { coords: [27.7172, 85.3240], zoom: 11, title: "Kathmandu Departure" }
    };

    // 4. Add Markers
    const markers = {};
    Object.keys(locations).forEach(key => {
        const loc = locations[key];
        // Custom Icon could go here, for now standard blue is fine or we style it
        const marker = L.marker(loc.coords).addTo(map)
            .bindPopup(`<b>${loc.title}</b>`);
        markers[key] = marker;
    });

    // 5. Draw Route Line (Approximate path)
    const routePoints = [
        locations.kathmandu.coords,
        locations.kyirong.coords,
        locations.saga.coords,
        locations.manasarovar.coords,
        locations.darchen.coords,
        locations.kailash.coords
    ];
    
    const polyline = L.polyline(routePoints, {
        color: '#c9a961', // Our Gold Accent Color
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 10', // Dotted line effect for "Travel"
        lineCap: 'round'
    }).addTo(map);


    // 6. Connect to Itinerary Scroll (Scrollytelling)
    // We hook into the existing IntersectionObserver setup in script.js logic
    // But since this is a separate module, we'll re-implement a targeted observer 
    // strictly for the map updates to avoid conflicts.

    const itineraryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const locId = entry.target.dataset.location;
                const locData = locations[locId];

                if (locData) {
                    // Fly to the location
                    map.flyTo(locData.coords, locData.zoom, {
                        animate: true,
                        duration: 2.0 // Slow cinematic pan
                    });

                    // Open the popup
                    const marker = markers[locId];
                    if (marker) marker.openPopup();
                }
            }
        });
    }, {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Trigger when item is largely centered
        threshold: 0
    });

    document.querySelectorAll('.itinerary-item').forEach(item => {
        itineraryObserver.observe(item);
    });

    // Force map resize on load to prevent grey tiles
    setTimeout(() => { map.invalidateSize(); }, 500);

});
