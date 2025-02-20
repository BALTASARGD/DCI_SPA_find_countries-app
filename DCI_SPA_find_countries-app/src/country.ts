import L from "leaflet";

async function loadCountryDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get("code");

    if (!countryCode) {
        console.error("Error: No se encontró el código del país en la URL.");
        document.getElementById("country-container")!.innerHTML = "<p>Error: No se encontró el código del país.</p>";
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        if (!response.ok) throw new Error("Error al obtener los datos del país");

        const data = await response.json();
        const country = data[0];

        // Insertar los datos en el HTML
        document.getElementById("country-name")!.textContent = country.name.common;
        document.getElementById("country-flag")!.setAttribute("src", country.flags.png);
        document.getElementById("country-description")!.textContent = country.name.official;
        document.getElementById("country-population")!.textContent = country.population.toLocaleString();
        document.getElementById("country-region")!.textContent = country.region;
        document.getElementById("country-subregion")!.textContent = country.subregion;
        document.getElementById("country-capital")!.textContent = country.capital ? country.capital[0] : "Sin capital";

        // Inicializar el mapa
        const map = L.map("map").setView([country.latlng[0], country.latlng[1]], 5); // usa las coordenadas del país

        // Añadir el mapa base de OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        // Añadir un marcador en el mapa
        L.marker([country.latlng[0], country.latlng[1]]).addTo(map)
            .bindPopup(`<b>${country.name.common}</b><br>${country.capital ? country.capital[0] : "Sin capital"}`)
            .openPopup();

    } catch (error) {
        console.error("Error al cargar los detalles del país:", error);
        document.getElementById("country-container")!.innerHTML = "<p>Error al cargar los detalles del país.</p>";
    }
}

document.addEventListener("DOMContentLoaded", loadCountryDetails);