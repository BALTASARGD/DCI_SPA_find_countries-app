import * as L from 'leaflet';

const API_URL = "https://restcountries.com/v3.1/alpha/";

async function loadCountryDetails() {
    const params = new URLSearchParams(window.location.search);
    const countryCode = params.get("code");

    if (!countryCode) return;

    const res = await fetch(API_URL + countryCode);
    const [country]: [{ name: { common: string }, capital: string[], population: number, region: string, flags: { png: string }, currencies: { [key: string]: { name: string } }, latlng: [number, number] }] = await res.json();

    document.body.style.backgroundImage = `url(${country.flags.png})`;
    document.body.style.backgroundSize = "cover";

    document.getElementById("country-details")!.innerHTML = `
        <h1>${country.name.common}</h1>
        <p>Capital: ${country.capital[0]}</p>
        <p>Population: ${country.population.toLocaleString()}</p>
        <p>Region: ${country.region}</p>
        <p>Currency: ${Object.values(country.currencies)[0].name}</p>
        <div id="map"></div>
    `;

    loadMap(country.latlng[0], country.latlng[1]);
}

function loadMap(lat: number, lng: number) {
    const map = L.map("map").setView([lat, lng], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    L.marker([lat, lng]).addTo(map);
}

loadCountryDetails();
