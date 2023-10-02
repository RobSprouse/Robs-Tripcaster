// COMMENT: Hide displayed weather data
$(document).ready(function () {
     $("#invalidEntry, .currentDayDiv, .forecastCards").hide();
});

// COMMENT: Define apiKey
let apiKey = "ae8a9c52dbc61de25a46b1c84484bee2";

let unixToDate = function (unixTime) {
     var jsDate = new Date(unixTime * 1000);
     var options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
     var formattedDate = jsDate.toLocaleDateString("en-US", options);
     return formattedDate;
};

// COMMENT: Event listener for submit
$("form").on("submit", function (event) {
     event.preventDefault();
     $("#invalidEntry").text(""); // clears error text
     let cityName = $("#cityName").val(); // user input defines the search for lat and lon
     if (!cityName.trim()) {
          $("#invalidEntry").show();
          $("#invalidEntry").text("Please follow the instructions and enter a city name.");
          return;
     }
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
                    // COMMENT: Append text if there is a problem with user input
                    $("#invalidEntry").show();
                    $("#invalidEntry").text(
                         "The weather data for the city you're searching for is not in the database of available cities, the input format was incorrect, is spelled incorrectly, or is not a valid city. Please, try again."
                    );
               } else {
                    console.log(cityData);
                    let city = cityData[0];
                    let cityNameStateCountry = `${city.name}${city.state ? ", " + city.state : ""} ${city.country}`;
                    let getCurrentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=imperial`;
                    console.log(getCurrentWeatherURL);
                    let getForecastedWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=imperial`;
                    console.log(getForecastedWeatherURL);

                    fetch(getCurrentWeatherURL)
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
                         .then((currentWeather) => {
                              console.log(currentWeather);
                              let recordedWeatherTime = currentWeather.dt;
                              let currentTemp = currentWeather.main.temp;
                              let currentHumidity = currentWeather.main.humidity;
                              let weatherIcon = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
                              $(".currentDay img").attr("src", weatherIcon);
                              $(".currentDay h4").text(cityNameStateCountry);
                              $(".currentDay h3").text(unixToDate(recordedWeatherTime));
                              $("#currentTemp").html("Temperature: " + currentTemp + " &deg;F");
                              $("#currentHumidity").text("Humidity: " + currentHumidity + " %");
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
                                   // if array is returned with 40 values, need to test if forecast's array changes this during the earlier hours, provided more forecasted data
                                   let forecastDate = forecastedWeather.list[i].dt;
                                   console.log(forecastDate);
                                   let temp = forecastedWeather.list[i].main.temp;
                                   let humidity = forecastedWeather.list[i].main.humidity;
                                   let weatherIcon = `https://openweathermap.org/img/wn/${forecastedWeather.list[i].weather[0].icon}@2x.png`;
                                   $("#date" + j).text(unixToDate(forecastDate));
                                   $("#img" + j).attr("src", weatherIcon);
                                   $("#temp" + j).html("Temperature: " + temp + " &deg;F");
                                   $("#humidity" + j).text("Humidity: " + humidity + " %");
                                   j++;
                              }
                              //
                         });
               }
          });
});

