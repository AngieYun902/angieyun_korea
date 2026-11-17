
'use strict';

// Initialize Glide.js destination carousel
if (typeof Glide !== 'undefined') {
    new Glide('.glide', {
        type: 'carousel',
        perView: 3,
        gap: 20,
        autoplay: 4500,
        hoverpause: true,
        breakpoints: {
            960: { perView: 2 },
            640: { perView: 1 }
        }
    }).mount();
}

// Initialize AOS scroll animations
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 750,
        once: true,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
}

// FsLightbox automatically activates gallery links using data-fslightbox

// Initialize Leaflet interactive map
if (typeof L !== 'undefined') {
    const map = L.map('korea-map', {
        scrollWheelZoom: false
    }).setView([36.15, 127.8], 7);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Destination locations and descriptions
    const places = [
        {
            name: 'Seoul',
            coords: [37.5665, 126.9780],
            detail: 'Palaces, shopping, and vibrant city life'
        },
        {
            name: 'Busan',
            coords: [35.1796, 129.0756],
            detail: 'Beaches, markets, and coastal views'
        },
        {
            name: 'Jeju Island',
            coords: [33.4996, 126.5312],
            detail: 'Volcanic scenery and island adventures'
        },
        {
            name: 'Gyeongju',
            coords: [35.8562, 129.2247],
            detail: 'Ancient history and cultural landmarks'
        }
    ];

    // Add clickable markers to the map
    places.forEach(({ name, coords, detail }) => {
        L.marker(coords)
            .addTo(map)
            .bindPopup(`<strong>${name}</strong><br>${detail}`);
    });
}

// Mobile navigation menu
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

// Toggle mobile menu when button is clicked
menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu after selecting a link
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
}));

// Trip planner form elements
const form = document.querySelector('#trip-form');
const startInput = document.querySelector('#start-date');
const endInput = document.querySelector('#end-date');

// Set minimum travel dates to today
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

startInput.min = localToday;
endInput.min = localToday;

// Update return date based on departure date
startInput.addEventListener('change', () => {
    endInput.min = startInput.value || localToday;
});

// Generate a trip summary when the form is submitted
form.addEventListener('submit', event => {
    event.preventDefault();

    const destination = document.querySelector('#destination').value;
    const start = startInput.value;
    const end = endInput.value;
    const result = document.querySelector('#trip-result');

    // Validate destination and travel dates
    if (!destination || !start || !end || end < start) {
        result.textContent = 'Please choose a destination and valid travel dates.';
        return;
    }

    // Calculate the number of nights
    const nights = Math.round(
        (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000
    );

    // Display the trip summary
    result.textContent = `Your ${destination} trip: ${start} to ${end} (${nights} night${nights === 1 ? '' : 's'}). Happy travels!`;
});
