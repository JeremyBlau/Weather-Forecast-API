const apiKey = "e5528239496e7faee40c0c1dd6ba8b30";

// Function to make the API call and fetch weather data
function getWeatherData(city) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(currentData => {
      // Process and display the current weather data
      displayCurrentWeather(currentData);

      // Fetch the 5-day forecast data
      fetch(forecastUrl)
        .then(response => response.json())
        .then(forecastData => {
          // Process and display the 5-day forecast data
          displayForecastWeather(forecastData);
        })
        .catch(error => {
          console.error("Error fetching forecast data:", error);
        });

      // Add the city to the search history
      addToSearchHistory(city);
    })
    .catch(error => {
      console.error("Error fetching current weather data:", error);
    });
}

// Function to display current weather data on the page
function displayCurrentWeather(data) {
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

function displayForecastWeather(forecastData) {
  const forecastDataElement = document.getElementById("forecast-data");
  forecastDataElement.innerHTML = ''; // Clear previous entries

  // Loop through the forecast data for the next 5 days
  for (let i = 0; i < forecastData.list.length; i += 8) {
    const forecastItem = forecastData.list[i];
    const date = new Date(forecastItem.dt * 1000).toLocaleDateString();
    const icon = forecastItem.weather[0].icon;
    const temperature = forecastItem.main.temp;
    const humidity = forecastItem.main.humidity;
    const windSpeed = forecastItem.wind.speed;

    const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;

    const forecastHTML = `
      <div class="forecast-item">
        <h4>${date}</h4>
        <p>Temperature: ${temperature} °F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} mph</p>
        <img src="${iconUrl}" alt="Weather Icon">
      </div>
    `;

    forecastDataElement.innerHTML += forecastHTML;
  }
}

// Function to add the city to the search history and local storage
const maxSearchHistoryItems = 5;

function addToSearchHistory(city) {
  const searchHistoryElement = document.getElementById("search-history");
  const searchItems = searchHistoryElement.querySelectorAll("li");

  // Check if a similar city (case-insensitive) is already in the search history
  const existingItem = Array.from(searchItems).find(item => item.textContent.toLowerCase() === city.toLowerCase());

  if (!existingItem) {
    const searchItem = document.createElement("li");
    searchItem.textContent = city;

    if (searchItems.length >= maxSearchHistoryItems) {
      searchHistoryElement.removeChild(searchItems[0]); // Remove the oldest search
    }

    searchHistoryElement.appendChild(searchItem);
    // Add a click event listener to the new search item to re-fetch data
    searchItem.addEventListener("click", function () {
      getWeatherData(city);
    });

    // Store the search history in local storage
    const storedHistory = localStorage.getItem("weatherSearchHistory");
    const historyArray = storedHistory ? JSON.parse(storedHistory) : [];

    // Check if a similar city (case-insensitive) is already in the history array
    const existingHistoryItem = historyArray.find(item => item.toLowerCase() === city.toLowerCase());
    if (!existingHistoryItem) {
      historyArray.push(city);
      localStorage.setItem("weatherSearchHistory", JSON.stringify(historyArray));
    }
  }
}

// Function to retrieve and display search history from local storage
function displaySearchHistory() {
  const searchHistoryElement = document.getElementById("search-history");
  const storedHistory = localStorage.getItem("weatherSearchHistory");
  const historyArray = storedHistory ? JSON.parse(storedHistory) : [];

  // Clear existing search history
  searchHistoryElement.innerHTML = '';

  // Display search history items (limit to a maximum of 5)
  const displayCount = Math.min(historyArray.length, maxSearchHistoryItems);
  for (let i = 0; i < displayCount; i++) {
    const city = historyArray[i];
    const searchItem = document.createElement("li");
    const searchButton = document.createElement("a");
    searchButton.textContent = city;
    searchButton.href = "#";
    searchButton.classList.add("previous-search-button");
    searchItem.appendChild(searchButton);

    searchHistoryElement.appendChild(searchItem);

    searchButton.addEventListener("click", function () {
      getWeatherData(city);
    });
  }
}

displaySearchHistory(); // Display search history when page loads

// Add event listener to the search form
const searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const city = document.getElementById("search-input").value;
  getWeatherData(city);
});