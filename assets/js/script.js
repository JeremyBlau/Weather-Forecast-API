 // Your API key
 const apiKey = "e5528239496e7faee40c0c1dd6ba8b30";

 // Function to make the API call and fetch weather data
 function getWeatherData(lat, lon) {
   const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

   fetch(url)
     .then(response => response.json())
     .then(data => {
       // Process and display the weather data
       displayWeatherData(data);
     })
     .catch(error => {
       console.error("Error fetching weather data:", error);
     });
 }

 // Function to display weather data on the page
 function displayWeatherData(data) {
   // This is just a basic example. You can customize the data display as needed.
   const weatherDataElement = document.getElementById("weather-data");
   weatherDataElement.innerHTML = JSON.stringify(data, null, 2);
 }

 // Example usage: Call the function with specific latitude and longitude
 // Replace these values with the latitude and longitude you want to query
 const latitude = 37.7749; // Example latitude (San Francisco)
 const longitude = -122.4194; // Example longitude (San Francisco)
 getWeatherData(latitude, longitude);