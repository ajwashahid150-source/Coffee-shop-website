document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map
    const map = L.map('map').setView([40.7128, -74.0060], 13); // Default to New York

    // Add OpenStreetMap tiles (Light theme - Google Maps style)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Coffee Shop Icon
    const coffeeIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/751/751621.png', // Generic coffee icon
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    // Delivery Icon
    const deliveryIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png', // Generic scooter/delivery icon
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    // Locations
    const shopLocation = [40.7128, -74.0060];
    const deliveryLocation = [40.7200, -74.0100]; // Slightly away
    const customerLocation = [40.7300, -74.0200]; // Destination

    // Add Markers
    L.marker(shopLocation, { icon: coffeeIcon })
        .addTo(map)
        .bindPopup('<strong>BrewMate Coffee Shop</strong><br>Order Prepared Here');

    const deliveryMarker = L.marker(deliveryLocation, { icon: deliveryIcon })
        .addTo(map)
        .bindPopup('<strong>Your Order</strong><br>On the way!');

    L.marker(customerLocation)
        .addTo(map)
        .bindPopup('<strong>Delivery Address</strong><br>123 Main St');

    // Draw route line (simple polyline)
    const route = [shopLocation, deliveryLocation, customerLocation];
    L.polyline(route, {
        color: '#D4A574', // Accent color
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);

    // Fit bounds to show all markers
    const group = new L.featureGroup([
        L.marker(shopLocation),
        L.marker(customerLocation)
    ]);
    map.fitBounds(group.getBounds().pad(0.1));

    // Simulate movement
    let progress = 0;
    setInterval(() => {
        progress += 0.01;
        if (progress > 1) progress = 0;

        // Simple interpolation between shop and customer for demo
        const lat = shopLocation[0] + (customerLocation[0] - shopLocation[0]) * progress;
        const lng = shopLocation[1] + (customerLocation[1] - shopLocation[1]) * progress;

        deliveryMarker.setLatLng([lat, lng]);
    }, 100);
});
