import L from "leaflet";
import axios from "axios";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

async function loadCountryDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get("code");

    if (!countryCode) {
        console.error("Error: Country code not found in URL.");
        document.getElementById("country-container")!.innerHTML = "<p>Error: Country code not found.</p>";
        return;
    }

    try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        if (!response.ok) throw new Error("Error fetching country data");

        const data = await response.json();
        const country = data[0];

        document.getElementById("country-name")!.textContent = country.name.common;
        document.getElementById("country-flag")!.setAttribute("src", country.flags.png);
        document.getElementById("country-description")!.textContent = country.name.official;
        document.getElementById("country-population")!.textContent = country.population.toLocaleString();
        document.getElementById("country-region")!.textContent = country.region;
        document.getElementById("country-subregion")!.textContent = country.subregion;
        document.getElementById("country-capital")!.textContent = country.capital ? country.capital[0] : "No capital";

        await loadCountryDescription(country.name.common);

        const map = L.map("map").setView([country.latlng[0], country.latlng[1]], 5);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        L.marker([country.latlng[0], country.latlng[1]]).addTo(map)
            .bindPopup(`<b>${country.name.common}</b><br>${country.capital ? country.capital[0] : "No capital"}`)
            .openPopup();

        loadPlacesOfInterest(country.name.common);

        loadCountryImages(country.name.common);

    } catch (error) {
        console.error("Error loading country details:", error);
        document.getElementById("country-container")!.innerHTML = "<p>Error loading country details.</p>";
    }
}

async function loadCountryDescription(countryName: string) {
    try {
        const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${countryName}`);
        const description = response.data.extract;

        document.getElementById("country-description")!.textContent = description;
    } catch (error) {
        console.error("Error loading country description:", error);
        document.getElementById("country-description")!.innerHTML = "<p>Error loading country description.</p>";
    }
}

async function loadPlacesOfInterest(countryName: string) {
    const placesOfInterest = [
        { type: "Accommodation", icon: "fas fa-hotel", query: "hotels" },
        { type: "Restaurants", icon: "fas fa-utensils", query: "restaurants" },
        { type: "Entertainment", icon: "fas fa-theater-masks", query: "entertainment" }
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

            const placeLink = document.createElement("a");
            placeLink.href = `https://www.google.com/search?q=${place.query}+in+${countryName}`;
            placeLink.target = "_blank";
            placeLink.appendChild(placeIcon);
            placeLink.appendChild(placeTitle);

            placeDiv.appendChild(placeLink);
            placesList.appendChild(placeDiv);
        }
    }
}

async function loadCountryImages(countryName: string) {
    try {
        const response = await axios.get(`https://api.unsplash.com/search/photos?query=${countryName}&client_id=${UNSPLASH_ACCESS_KEY}`);
        const images = (response.data as { results: any[] }).results.slice(0, 6);

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
        console.error("Error loading country images:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadCountryDetails);