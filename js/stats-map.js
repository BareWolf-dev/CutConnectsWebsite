
document.addEventListener('DOMContentLoaded', () => {
    fetchStatsData();
});

async function fetchStatsData() {
    try {
        const response = await fetch('js/stats.json');
        const data = await response.json();

        if (data.stats) {
            renderStats(data.stats);
        }

        if (data.locations) {
            initMap(data.locations);
        }
    } catch (error) {
        console.error('Error loading stats data:', error);
    }
}

function renderStats(stats) {
    const container = document.getElementById('stats-container');
    container.innerHTML = '';

    stats.forEach(stat => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';

        // Use color for the number
        const colorStyle = stat.color ? `color: ${stat.color}; text-shadow: 0 0 25px ${stat.color}66;` : '';

        statItem.innerHTML = `
            <span class="stat-number" style="${colorStyle}" data-target="${stat.value}">0</span>
            <span class="stat-label">${stat.label}</span>
        `;

        container.appendChild(statItem);
    });

    // Start animation loop
    animateNumbers();
}

function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');

    numbers.forEach(num => {
        const target = +num.getAttribute('data-target');
        // Faster animation: 1.5 seconds default, but faster for smaller numbers
        const duration = 1500;
        const frameRate = 60;
        const totalFrames = (duration / 1000) * frameRate;
        const increment = target / totalFrames;

        let current = 0;

        const updateCount = () => {
            current += increment;

            if (current < target) {
                num.innerText = Math.ceil(current);
                requestAnimationFrame(updateCount);
            } else {
                num.innerText = target.toLocaleString(); // Add commas for thousands
            }
        };

        updateCount();
    });
}

function initMap(locations) {
    // Default fallback center (New York)
    const defaultLat = 40.7128;
    const defaultLng = -74.0060;

    // Enable interaction: dragging and zoom but keep UI minimal
    const map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView([defaultLat, defaultLng], 3);

    // CartoDB Dark Matter Tiles for blending
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
    }).addTo(map);

    // Custom Marker Options
    const markerOptions = {
        radius: 6,
        fillColor: "#ff0055", // Accent
        color: "#fff",
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.8
    };

    // Add static markers from JSON (Global reach)
    locations.forEach(loc => {
        L.circleMarker([loc.lat, loc.lng], markerOptions)
            .addTo(map)
            .bindPopup(`<b>${loc.name}</b>`);
    });

    // Handle "Locate Me" Click
    const locateBtn = document.getElementById('locate-me-btn');

    const handleSuccess = (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        locateBtn.innerText = "📍 Locate Me";

        // Fly to user location (Street level)
        map.flyTo([userLat, userLng], 14, {
            animate: true,
            duration: 1.5
        });

        // Remove existing user marker
        map.eachLayer((layer) => {
            if (layer.options.icon && layer.options.icon.options.className === 'user-location-marker') {
                map.removeLayer(layer);
            }
        });

        // Add user marker
        const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: '<div class="pulsating-circle"></div>',
            iconSize: [20, 20]
        });

        L.marker([userLat, userLng], { icon: userIcon })
            .addTo(map)
            .bindPopup("<b>You are here</b>")
            .openPopup();

        // GENERATE RANDOM "NEAREST" SHOPS
        for (let i = 0; i < 8; i++) {
            const latOffset = (Math.random() - 0.5) * 0.02;
            const lngOffset = (Math.random() - 0.5) * 0.02;

            L.circleMarker([userLat + latOffset, userLng + lngOffset], {
                ...markerOptions,
                fillColor: "#7000ff", // Purple for shops
                radius: 8
            })
                .addTo(map)
                .bindPopup(`<b>CutConnects Partner #${i + 1}</b><br>0.5km away`);
        }
    };

    const handleError = (error, isRetry = false) => {
        console.error("Location error:", error);

        // Retry logic for Position Unavailable or Timeout
        if (!isRetry && (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT)) {
            console.log("Retrying with lower accuracy...");
            const fallbackOptions = {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 10000 // Accept cached positions up to 10s old
            };
            navigator.geolocation.getCurrentPosition(
                handleSuccess,
                (retryError) => handleError(retryError, true), // If fails again, show error
                fallbackOptions
            );
            return;
        }

        locateBtn.innerText = "❌ Error";

        let msg = "Unknown error occurred.";
        switch (error.code) {
            case error.PERMISSION_DENIED:
                msg = "Permission denied. Please allow location access.";
                break;
            case error.POSITION_UNAVAILABLE:
                msg = "Location unavailable. Please check your GPS/network.";
                break;
            case error.TIMEOUT:
                msg = "Request timed out.";
                break;
        }

        // Fallback check
        if (!msg || msg === "Unknown error occurred.") {
            if (error.code === 1) msg = "Permission denied.";
            else if (error.code === 2) msg = "Position unavailable.";
            else if (error.code === 3) msg = "Request timed out.";
        }

        alert(`Could not get your location:\n${msg}\n(Code: ${error.code})`);
        setTimeout(() => locateBtn.innerText = "📍 Locate Me", 3000);
    };

    if (locateBtn) {
        locateBtn.addEventListener('click', () => {
            locateBtn.innerText = "📍 Locating...";

            if (navigator.geolocation) {
                // First attempt: High Accuracy, fresh data
                const options = {
                    enableHighAccuracy: true,
                    timeout: 7000,
                    maximumAge: 0
                };

                navigator.geolocation.getCurrentPosition(
                    handleSuccess,
                    (error) => handleError(error, false),
                    options
                );
            } else {
                alert("Geolocation is not supported by your browser.");
            }
        });
    }

    // Auto-trigger "Locate Me" on load
    setTimeout(() => {
        if (locateBtn) locateBtn.click();
    }, 1000);
}
