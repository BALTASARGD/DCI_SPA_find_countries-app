const API_URL = "https://restcountries.com/v3.1/all";

async function fetchCountries() {
    const res = await fetch(API_URL);
    const countries = await res.json();
    return countries;
}

async function loadCountries() {
    const countryList = document.getElementById("country-list")!;
    const searchInput = document.getElementById("search") as HTMLInputElement;
    const filterSelect = document.getElementById("continent-filter") as HTMLSelectElement;

    let countries = await fetchCountries();

    function renderCountries() {
        let filteredCountries = countries.filter((country: { name: { common: string }, region: string, flags: { png: string }, cca3: string }) => 
            country.name.common.toLowerCase().includes(searchInput.value.toLowerCase()) &&
            (filterSelect.value === "" || country.region === filterSelect.value)
        );

        countryList.innerHTML = filteredCountries.map((country: { name: { common: string }, region: string, flags: { png: string }, cca3: string }) => `
            <div class="country">
                <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
                <h2>${country.name.common}</h2>
                <button onclick="location.href='/country.html?code=${country.cca3}'">View More</button>
            </div>
        `).join("");
    }

    searchInput.addEventListener("input", renderCountries);
    filterSelect.addEventListener("change", renderCountries);

    renderCountries();
}

loadCountries();
