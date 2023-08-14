const apiKey = "e5528239496e7faee40c0c1dd6ba8b30";
const maxSearchHistoryItems = 5;

// Function to make the API call and fetch weather data
function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Add this console log to see the data returned by the API
      console.log("Weather Data:", data);

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

  // Convert Kelvin to Fahrenheit
  const temperatureInKelvin = data.main.temp;
  const temperatureInFahrenheit = (temperatureInKelvin - 273.15) * 9/5 + 32;

  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
  const weatherHTML = `
    <h2>${cityName} (${date})</h2>
    <p>Temperature: ${temperatureInFahrenheit.toFixed(2)} °F</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} mph</p>
    <img src="${iconUrl}" alt="Weather Icon">
  `;

  weatherDataElement.innerHTML = weatherHTML;
}

// Function to add the city to the search history
function addToSearchHistory(city) {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Check if the city is already in the search history
  const existingItem = searchHistory.find(item => item === city);

  if (!existingItem) {
    searchHistory.push(city);

    if (searchHistory.length > maxSearchHistoryItems) {
      searchHistory.shift(); // Remove the oldest search
    }

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    displaySearchHistory(); // Update the search history UI
  }
}

// Function to display the search history on the page
function displaySearchHistory() {
  const searchHistoryElement = document.getElementById("search-history");
  searchHistoryElement.innerHTML = ""; // Clear previous content

  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  searchHistory.forEach(city => {
    const searchItem = document.createElement("li");
    searchItem.textContent = city;
    searchHistoryElement.appendChild(searchItem);

    searchItem.addEventListener("click", function () {
      getWeatherData(city);
    });
  });
}

// Add event listener to the search form
const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = document.getElementById("search-input").value;
  getWeatherData(city);
});

// Call the function to display initial search history when the page loads
displaySearchHistory();