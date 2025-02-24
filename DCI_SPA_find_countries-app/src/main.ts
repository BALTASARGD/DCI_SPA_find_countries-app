import { getCountries } from "./api";
import "./style.css";

const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
if (favicon) {
  favicon.href = "/favicon.ico";
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search") as HTMLInputElement;
  const continentSelect = document.getElementById(
    "continent-filter"
  ) as HTMLSelectElement;

  fetchCountries();

  searchInput.addEventListener("input", () => {
    fetchCountries(searchInput.value, continentSelect.value);
  });

  continentSelect.addEventListener("change", () => {
    fetchCountries(searchInput.value, continentSelect.value);
  });
});

async function fetchCountries(searchTerm: string = "", continent: string = "") {
  const countriesContainer = document.getElementById("countries-container");
  if (!countriesContainer) return;

  try {
    const countries = await getCountries(continent);

    const filteredCountries = countries.filter((country) =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );

    countriesContainer.innerHTML = "";

    filteredCountries.forEach((country) => {
      const countryDiv = document.createElement("div");
      countryDiv.classList.add("country");

      countryDiv.innerHTML = `
        <h1 class="text-2xl font-bold mb-2 text-blue-custom">${country.name.common}</h1>
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="w-full h-48 object-cover rounded-md mb-4" />
        <p class="text-blue-custom"><strong>Region:</strong> ${country.region}</p>
        <p class="text-blue-custom"><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p class="text-blue-custom"><strong>Capital:</strong> ${
          country.capital ? country.capital[0] : "N/A"
        }</p>
        <button onclick="location.href='/country.html?code=${
          country.cca3
        }'" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">View Details</button>
      `;
      countriesContainer.appendChild(countryDiv);
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}