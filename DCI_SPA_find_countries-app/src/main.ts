async function fetchCountries() {
    try {
        // Llamar a la API para obtener la lista de países
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) throw new Error("Failed to fetch countries");

        const countries = await response.json();

        // Obtener el contenedor donde vamos a mostrar la lista de países
        const countriesContainer = document.getElementById("countries-container");

        if (!countriesContainer) {
            console.error("Countries container not found.");
            return;
        }

        // Limpiar el contenedor
        countriesContainer.innerHTML = "";

        // Renderizar cada país en la lista
        countries.forEach((country: any) => {
            const countryDiv = document.createElement("div");
            countryDiv.classList.add("country");

            // Asegurarnos de que el país tiene los datos que necesitamos
            const flag = country.flags ? country.flags.png : "default-flag.png";
            const population = country.population ? country.population : "N/A";
            const region = country.region ? country.region : "N/A";
            const subregion = country.subregion ? country.subregion : "N/A";
            const capital = country.capital ? country.capital[0] : "N/A";

            // Crear el contenido HTML para cada país
            countryDiv.innerHTML = `
                <h2>${country.name.common}</h2>
                <img src="${flag}" alt="Flag of ${country.name.common}" />
                <p><strong>Region:</strong> ${region}</p>
                <p><strong>Population:</strong> ${population.toLocaleString()}</p>
                <p><strong>Subregion:</strong> ${subregion}</p>
                <p><strong>Capital:</strong> ${capital}</p>
                <a href="/country.html?code=${country.cca3}">View Details</a>
            `;

            // Añadir el país al contenedor
            countriesContainer.appendChild(countryDiv);
        });
    } catch (error) {
        console.error("Error fetching countries:", error);
    }
}

// Llamar a la función cuando la página cargue
document.addEventListener("DOMContentLoaded", fetchCountries);
