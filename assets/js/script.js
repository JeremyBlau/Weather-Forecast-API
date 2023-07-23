const apiKey = "e5528239496e7faee40c0c1dd6ba8b30";

// Function to make the API call and fetch weather data
function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Process and display the weather data
      displayWeatherData(data);
      // Add the city to the search history
      addToSearchHistory(city);
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
    });
}

// Function to display weather data on the page
function displayWeatherData(data) {
  // This is just a basic example. You can customize the data display as needed.
  const weatherDataElement = document.getElementById("weather-data");
  const cityName = data.name;
  const date = new Date(data.dt * 1000).toLocaleDateString();
  const icon = data.weather[0].icon;
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  const weatherHTML = `
    <h2>${cityName} (${date})</h2>
    <p>Temperature: ${temperature} °F</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} mph</p>
    <!-- Add icon representation of weather conditions here -->
  `;
  
  weatherDataElement.innerHTML = weatherHTML;
}

// Function to add the city to the search history
function addToSearchHistory(city) {
  const searchHistoryElement = document.getElementById("search-history");
  const searchItem = document.createElement("li");
  searchItem.textContent = city;
  searchHistoryElement.appendChild(searchItem);
}

// Example usage: Call the function with specific city name
// You can replace "New York" with any other city name you want to query
getWeatherData("New York");

// Add event listener to the search form
const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = document.getElementById("search-input").value;
  getWeatherData(city);
});