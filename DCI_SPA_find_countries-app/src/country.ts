import L from "leaflet";
import axios from "axios";

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

        // Cargar sitios de interés
        loadPlacesOfInterest(country.name.common);

        // Cargar imágenes del país
        loadCountryImages(country.name.common);

    } catch (error) {
        console.error("Error al cargar los detalles del país:", error);
        document.getElementById("country-container")!.innerHTML = "<p>Error al cargar los detalles del país.</p>";
    }
}

async function loadPlacesOfInterest(countryName: string) {
    const placesOfInterest = [
        { type: "Alojamiento", icon: "fas fa-hotel" },
        { type: "Restaurantes", icon: "fas fa-utensils" },
        { type: "Ocio", icon: "fas fa-theater-masks" }
    ];

    const placesList = document.getElementById("places-of-interest");
    if (placesList) {
        placesList.innerHTML = "";
        for (const place of placesOfInterest) {
            const placeDiv = document.createElement("div");
            placeDiv.classList.add("place", "bg-gray-100", "p-4", "rounded-md", "shadow-md", "text-center");

            const placeIcon = document.createElement("i");
            placeIcon.className = `${place.icon} text-4xl mb-2 text-blue-500`;

            const placeTitle = document.createElement("h3");
            placeTitle.classList.add("text-lg", "font-bold", "mb-1");
            placeTitle.textContent = place.type;

            placeDiv.appendChild(placeIcon);
            placeDiv.appendChild(placeTitle);
            placesList.appendChild(placeDiv);
        }
    }
}

async function loadCountryImages(countryName: string) {
    try {
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${countryName}&client_id=a13zuW_gUniDQEL7D1mIQC5JOfug00Bp-2YUF-HWMjM`);
        const images = (response.data as { results: any[] }).results;

        const imagesContainer = document.getElementById("country-images");
        if (imagesContainer) {
            imagesContainer.innerHTML = "";
            images.forEach((image: any) => {
                const imgElement = document.createElement("img");
                imgElement.src = image.urls.small;
                imgElement.alt = image.alt_description;
                imgElement.classList.add("w-full", "h-auto", "rounded-md");
                imagesContainer.appendChild(imgElement);
            });
        }
    } catch (error) {
        console.error("Error al cargar las imágenes del país:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadCountryDetails);