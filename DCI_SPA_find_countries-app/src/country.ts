async function loadCountryDetails() {
    // Obtener el código del país desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get("code");

    if (!countryCode) {
        console.error("Error: No country code found in URL.");
        document.getElementById("country-container")!.innerHTML = "<p>Error: No country code found.</p>";
        return;
    }

    try {
        // Llamar a la API para obtener los detalles del país
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        if (!response.ok) throw new Error("Failed to fetch country data");

        const data = await response.json();
        const country = data[0];

        // Insertar los datos en el HTML
        document.getElementById("country-name")!.textContent = country.name.common;
        document.getElementById("country-flag")!.setAttribute("src", country.flags.png);
        document.getElementById("country-description")!.textContent = country.name.official;
        document.getElementById("country-population")!.textContent = country.population.toLocaleString();
        document.getElementById("country-region")!.textContent = country.region;
        document.getElementById("country-subregion")!.textContent = country.subregion;
        document.getElementById("country-capital")!.textContent = country.capital ? country.capital[0] : "No capital";

    } catch (error) {
        console.error("Error loading country details:", error);
        document.getElementById("country-container")!.innerHTML = "<p>Failed to load country details.</p>";
    }
}

// Ejecutar cuando la página cargue
document.addEventListener("DOMContentLoaded", loadCountryDetails);
