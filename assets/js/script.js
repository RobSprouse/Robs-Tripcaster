// COMMENT: Document ready function
$(document).ready(function () {
     $("#invalidEntry, .currentDayDiv, .forecastCards").hide(); // hides the empty divs
     let cityList = $(".cityHistory");
     Object.keys(localStorage).forEach(function (key) {
          // displays the locally stored locations
          let getKey = localStorage.getItem(key);
          let list = $("<p></p>");
          list.text(getKey);
          cityList.append(list);
     });

     // COMMENT: event listener for submit
     $("form").on("submit", function (event) {
          event.preventDefault();
          $("#invalidEntry").text(""); // clears error text
          let cityName = $("#cityName").val(); // user input defines the search for lat and lon
          if (!cityName.trim()) {
               // if it's empty, display text
               $("#invalidEntry").show();
               $("#invalidEntry").text("Please follow the instructions and enter a city name.");
               return;
          }
          getWeather(cityName);
     });

     // COMMENT: event listener for search history
     $(".cityHistory").on("click", "p", function () {
          let cityNameStateCountry = $(this).text(); // when the search history cities are clicked, it takes that and searches local storage for it and its key pair
          let key = Object.keys(localStorage).find((key) => localStorage.getItem(key) === cityNameStateCountry);
          let latLonArray = key.split(", ").map(parseFloat);
          let getCurrentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latLonArray[0]}&lon=${latLonArray[1]}&appid=${apiKey}&units=imperial`; // assigns the local storage lat and lon to the url
          let getForecastedWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latLonArray[0]}&lon=${latLonArray[1]}&appid=${apiKey}&units=imperial`; // assigns the local storage lat and lon to the url
          getCurrentWeatherData(getCurrentWeatherURL, cityNameStateCountry); // calls the function and passes the variables to it
          getForecastedWeatherData(getForecastedWeatherURL, cityNameStateCountry); // calls the function and passes the variables to it
     });
});

// COMMENT: Defines api key and unix time converter function expression
const apiKey = "ae8a9c52dbc61de25a46b1c84484bee2";
let getCurrentWeatherURL = "";
let getForecastedWeatherURL = "";

let unixToDate = function (unixTime) {
     let jsDate = new Date(unixTime * 1000); // converts unix to js time
     let options = { year: "numeric", month: "long", day: "numeric" }; // options for new date format
     let formattedDate = jsDate.toLocaleDateString("en-US", options); // formats date
     return formattedDate; // returns the value
};

// COMMENT: Declares the function get weather which gets the lat and lon for a city, and uses that to get current and forecaster weather
function getWeather(cityName) {
     $("#invalidEntry").text(""); // clears error text
     let getLatLonURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`; // api to get lat and lon
     fetch(getLatLonURL) // fetches lon and lat
          .then((response) => {
               // checks for errors and if the api isn't working, display's text
               if (!response.ok) {
                    $("#invalidEntry").show();
                    $("#invalidEntry").text("The response from the weather api failed. Please try again.");
                    throw new Error("HTTP error " + response.status);
               }
               return response.json();
          })
          .then((cityData) => {
               if (cityData.length === 0) {
                    // if there is no city data returned from the api, display why
                    $("#invalidEntry").show();
                    $("#invalidEntry").text(
                         "The weather data for the city you're searching for is not in the database of available cities, the input format was incorrect, is spelled incorrectly, or is not a valid city. Please, try again."
                    );
               } else {
                    // COMMENT: Defines variables for the storage and fetching of weather data
                    let city = cityData[0]; // assigns data to a variable to easily grab it's objects
                    let cityNameStateCountry = `${city.name}${city.state ? ", " + city.state : ""} ${city.country}`; // grabs the api's defined value for each to assign it to the value of the key/value pair in storage, helps prevent errors from user input
                    let key = `${city.lat}, ${city.lon}`; // defines what the key will be in storage
                    let storedKeys = Object.keys(localStorage); // defines what the stored keys will be then checks if the most recent keys are already in storage or not, appends based on if statement
                    if (!storedKeys.includes(key)) {
                         let addHistory = $("<p>").text(cityNameStateCountry);
                         $(".cityHistory").append(addHistory);
                         localStorage.setItem(key, cityNameStateCountry); // stores the key/value pair [lat, lon/cityName, state, country] in local storage
                    }
                    let getCurrentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=imperial`; // current weather fetch URL
                    let getForecastedWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=imperial`; // forecasted weather fetch URL
                    getCurrentWeatherData(getCurrentWeatherURL, cityNameStateCountry);
                    getForecastedWeatherData(getForecastedWeatherURL, cityNameStateCountry);
               }
          });
}

function getCurrentWeatherData(getCurrentWeatherURL, cityNameStateCountry) {
     // COMMENT: Fetches current weather
     fetch(getCurrentWeatherURL)
          .then((response) => {
               if (!response.ok) {
                    // checks for errors and if the api isn't working, display's text
                    throw new Error("HTTP error " + response.status);
                    $("#invalidEntry").show();
                    $("#invalidEntry").text("The response from the weather api failed. Please try again.");
               }
               return response.json();
          })
          .then((currentWeather) => {
               // COMMENT: Defines the variables that will be pulled from the response and displays them
               let recordedWeatherTime = currentWeather.dt;
               let currentTemp = currentWeather.main.temp;
               let currentHumidity = currentWeather.main.humidity;
               let currentWindSpeed = currentWeather.wind.speed;
               let weatherIcon = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`; // uses the icon from openweathermap.org api
               $(".currentDay img").attr("src", weatherIcon);
               $(".currentDay h4").text(cityNameStateCountry);
               $(".currentDay h3").text(unixToDate(recordedWeatherTime)); // unixToDate formats the grabbed date to the local date
               $("#currentTemp").html("Temperature: " + currentTemp + " &deg;F");
               $("#currentHumidity").text("Humidity: " + currentHumidity + " %");
               $("#currentWindSpeed").text("Wind Speed " + currentWindSpeed + " Mph");
               $(".currentDayDiv, .forecastCards").show();
          });
}

function getForecastedWeatherData(getForecastedWeatherURL, cityNameStateCountry) {
     // COMMENT: fetches the forecast
     fetch(getForecastedWeatherURL)
          .then((response) => {
               if (!response.ok) {
                    // checks for errors and if the api isn't working, display's text
                    throw new Error("HTTP error " + response.status);
                    $("#invalidEntry").show();
                    $("#invalidEntry").text("The response from the weather api failed. Please try again.");
               }
               return response.json();
          })
          .then((forecastedWeather) => {
               // COMMENT: Defines the variables that will be pulled from the response and displays them
               var j = 1;
               for (var i = 7; i < forecastedWeather.list.length; i += 8) {
                    let forecastDate = forecastedWeather.list[i].dt;
                    let temp = forecastedWeather.list[i].main.temp;
                    let humidity = forecastedWeather.list[i].main.humidity;
                    let weatherIcon = `https://openweathermap.org/img/wn/${forecastedWeather.list[i].weather[0].icon}@2x.png`; // uses the icon from openweathermap.org api
                    let windSpeed = forecastedWeather.list[i].wind.speed;
                    $("#date" + j).text(unixToDate(forecastDate)); // unixToDate formats the grabbed date to the local date
                    $("#img" + j).attr("src", weatherIcon);
                    $("#temp" + j).html("Temperature: " + temp + " &deg;F");
                    $("#humidity" + j).text("Humidity: " + humidity + " %");
                    $("#windSpeed" + j).text("Wind Speed " + windSpeed + " Mph");
                    j++;
               }
          });
}
