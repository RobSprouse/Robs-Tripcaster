$(document).ready(function () {
  $("#invalidEntry").hide();
  $(".currentDay").hide();
});

let apiKey = "ae8a9c52dbc61de25a46b1c84484bee2";

$("form").on("submit", function (event) {
  event.preventDefault();
  $("#invalidEntry").text("");
  let cityName = $("#cityName").val();
  let getLatLonURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&appid=" +
    apiKey;

    fetch(getLatLonURL)
    .then((response) => {
      if (!response.ok) {
        $("#invalidEntry").show();
        $("#invalidEntry").text(
          "The response from the weather api failed. Please try again."
        );
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        // COMMENT: Append text if there is a problem with user input
        $("#invalidEntry").show();
        $("#invalidEntry").text(
          "The weather data for the city you're searching for is not in the database of available cities, the input format was incorrect, is spelled incorrectly, or is not a valid city. Please, try again."
        );
      } else {
        let cityData = data[0];
        let coordinates = cityData.lat + "," + cityData.lon;
        // localStorage.setItem(coordinates, JSON.stringify(cityData));

        let getWeatherURL =
          "http://api.openweathermap.org/data/2.5/forecast?lat=" +
          cityData.lat +
          "&lon=" +
          cityData.lon +
          "&appid=" +
          apiKey +
          "&units=imperial";
        console.log(getWeatherURL);

        fetch(getWeatherURL)
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
          .then((data) => {
            console.log(data.list);
            $(".currentDay").show();
            $(".currentDay h4").text(cityName);
            $(".currentDay h3").text(data.list[0].dt_txt);
            console.log(data.list[0].weather[0].icon);
            let weatherIcon =
              "https://openweathermap.org/img/wn/" +
              data.list[0].weather[0].icon +
              "@2x.png";
            console.log(weatherIcon);
            $(".currentDay img").attr("src", weatherIcon);
          });
      }
    });
});
