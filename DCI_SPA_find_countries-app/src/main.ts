import { getCountries } from './api'; // Suponiendo que tienes una función para obtener países de tu API
import "./style.css";

// Función para cargar países al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search') as HTMLInputElement;
  const continentSelect = document.getElementById('continent-filter') as HTMLSelectElement;

  // Llamar a la función para obtener países
  fetchCountries();

  // Filtrar por búsqueda
  searchInput.addEventListener('input', () => {
    fetchCountries(searchInput.value, continentSelect.value);
  });

  // Filtrar por continente
  continentSelect.addEventListener('change', () => {
    fetchCountries(searchInput.value, continentSelect.value);
  });
});

// Obtener países de la API
async function fetchCountries(searchTerm: string = '', continent: string = '') {
  const countriesContainer = document.getElementById('countries-container');
  if (!countriesContainer) return;

  try {
    const countries = await getCountries(continent);
    
    // Filtrar por nombre
    const filteredCountries = countries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Mostrar los países
    countriesContainer.innerHTML = ''; // Limpiar contenido actual

    filteredCountries.forEach(country => {
      const countryDiv = document.createElement('div');
      countryDiv.classList.add('country');
      
      countryDiv.innerHTML = `
        <h2>${country.name.common}</h2>
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}" />
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <button onclick="location.href='/country.html?code=${country.cca3}'">View Details</button>
      `;
      countriesContainer.appendChild(countryDiv);
    });
    
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
}