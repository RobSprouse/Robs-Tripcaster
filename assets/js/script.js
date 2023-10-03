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
          let cityName = $(this).text();
          getWeather(cityName);
     });
});

// COMMENT: Defines api key and unix time converter function expression
const apiKey = "ae8a9c52dbc61de25a46b1c84484bee2";

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
                    console.log(getCurrentWeatherURL);
                    let getForecastedWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=imperial`; // forecasted weather fetch URL
                    console.log(getForecastedWeatherURL);

                    // COMMENT: Fetches current weather
                    fetch(getCurrentWeatherURL)
                         .then((response) => {
                              if (!response.ok) {
                                   // checks for errors and if the api isn't working, display's text
                                   throw new Error("HTTP error " + response.status);
                                   $("#invalidEntry").show();
                                   $("#invalidEntry").text(
                                        "The response from the weather api failed. Please try again."
                                   );
                              }
                              return response.json();
                         })
                         .then((currentWeather) => {
                              console.log(currentWeather);
                              let recordedWeatherTime = currentWeather.dt;
                              let currentTemp = currentWeather.main.temp;
                              let currentHumidity = currentWeather.main.humidity;
                              let currentWindSpeed = currentWeather.wind.speed;
                              let weatherIcon = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
                              $(".currentDay img").attr("src", weatherIcon);
                              $(".currentDay h4").text(cityNameStateCountry);
                              $(".currentDay h3").text(unixToDate(recordedWeatherTime));
                              $("#currentTemp").html("Temperature: " + currentTemp + " &deg;F");
                              $("#currentHumidity").text("Humidity: " + currentHumidity + " %");
                              $("#currentWindSpeed").text("Wind Speed " + currentWindSpeed + " Mph");
                              $(".currentDayDiv, .forecastCards").show();
                         });

                    fetch(getForecastedWeatherURL)
                         .then((response) => {
                              if (!response.ok) {
                                   throw new Error("HTTP error " + response.status);
                                   // COMMENT: Append text if there was a failed response.
                                   $("#invalidEntry").show();
                                   $("#invalidEntry").text(
                                        "The response from the weather api failed. Please try again."
                                   );
                              }
                              return response.json();
                         })
                         .then((forecastedWeather) => {
                              console.log(forecastedWeather);
                              // console.log(forecastedWeather.list[6].weather[0].icon)
                              console.log("1st day " + forecastedWeather.list[6].dt);
                              // console.log(forecastedWeather.list[6].main.temp);
                              // console.log(forecastedWeather.list[6].main.humidity);
                              console.log("2nd day " + forecastedWeather.list[14].dt);
                              console.log("3rd day " + forecastedWeather.list[22].dt);
                              console.log("4th day " + forecastedWeather.list[30].dt);
                              console.log("5th day " + forecastedWeather.list[38].dt);
                              var j = 1;
                              for (var i = 5; i < forecastedWeather.list.length; i += 8) {
                                   // TODO: if array is returned with 40 values, need to test if forecast's array changes this during the earlier hours, provided more forecasted data
                                   let forecastDate = forecastedWeather.list[i].dt;
                                   console.log(forecastDate);
                                   let temp = forecastedWeather.list[i].main.temp;
                                   let humidity = forecastedWeather.list[i].main.humidity;
                                   let weatherIcon = `https://openweathermap.org/img/wn/${forecastedWeather.list[i].weather[0].icon}@2x.png`;
                                   let windSpeed = forecastedWeather.list[i].wind.speed;
                                   console.log(windSpeed);
                                   $("#date" + j).text(unixToDate(forecastDate));
                                   $("#img" + j).attr("src", weatherIcon);
                                   $("#temp" + j).html("Temperature: " + temp + " &deg;F");
                                   $("#humidity" + j).text("Humidity: " + humidity + " %");
                                   $("#windSpeed" + j).text("Wind Speed " + windSpeed + " Mph");
                                   j++;
                              }
                         });
               }
          });
}
