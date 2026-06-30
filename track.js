// script.js - Map and Tracking Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check if the map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // 1. Initialize the Map (using Leaflet, which is already linked in HTML)
    // Using a central location for the coffee shop (e.g., a generic city center)
    const shopLat = 34.0522; // Example: Los Angeles
    const shopLng = -118.2437;
    const userLat = 34.0722; // Example: A location slightly north-east of the shop
    const userLng = -118.2237;

    const map = L.map('map').setView([shopLat, shopLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 2. Define Markers
    // Coffee Shop Marker (Source)
    const shopIcon = L.divIcon({
        className: 'custom-div-icon shop-icon',
        html: '<div style="font-size: 24px;">☕</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });
    const shopMarker = L.marker([shopLat, shopLng], { icon: shopIcon }).addTo(map)
        .bindPopup('BrewMate Coffee Shop').openPopup();

    // User Location Marker (Destination)
    const userIcon = L.divIcon({
        className: 'custom-div-icon user-icon',
        html: '<div style="font-size: 24px;">🏠</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });
    const userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map)
        .bindPopup('Your Delivery Location');

    // Delivery Bike/Person Marker (The one that moves)
    const deliveryIcon = L.divIcon({
        className: 'custom-div-icon delivery-icon',
        html: '<div style="font-size: 24px;">🛵</div>', // Using a scooter/bike emoji
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });
    const deliveryMarker = L.marker([shopLat, shopLng], { icon: deliveryIcon }).addTo(map)
        .bindPopup('Your Order is on the way!');

    // 3. Simulate Tracking Animation
    const totalSteps = 100;
    let currentStep = 0;

    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    function animateDelivery() {
        if (currentStep <= totalSteps) {
            const t = currentStep / totalSteps;

            // Linear interpolation for smooth movement
            const currentLat = lerp(shopLat, userLat, t);
            const currentLng = lerp(shopLng, userLng, t);

            deliveryMarker.setLatLng([currentLat, currentLng]);

            // Center the map view on the delivery person
            map.setView([currentLat, currentLng], 14);

            currentStep++;
            requestAnimationFrame(animateDelivery);
        } else {
            // Animation complete
            deliveryMarker.bindPopup('Order Delivered! Enjoy your coffee!').openPopup();
            // Update status step to 'Delivered' if needed
        }
    }

    // Start the animation after a short delay
    setTimeout(animateDelivery, 1000);
});