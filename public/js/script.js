const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition( (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('locationUpdate', { latitude, longitude });
    }, (error) => {
        console.error('Error obtaining location', error);
    },{
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    }
);
}

const map = L.map('map').setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const marker = {};

socket.on('location-update', function (data)  {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (marker[id]) {
        marker[id].setLatLng([latitude, longitude]);
    } else {
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }   

});

socket.on('user-disconnected', function (id) {
    if (marker[id]) {
        map.removeLayer(marker[id]);
        delete marker[id];
    }   
});

