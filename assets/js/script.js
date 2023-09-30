$(document).ready(function () {
    $("#invalidEntry").hide();
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
        if (data.length === 0) {
          // COMMENT: Append text if there is a problem with user input
          $("#invalidEntry").show();
          $("#invalidEntry").text(
            "The weather data for the city you're searching for is not in the database of available cities, the input format was incorrect, is spelled incorrectly, or is not a valid city. Please, try again."
          );
        } else {
          let cityData = data[0];
          let coordinates = cityData.lat + ',' + cityData.lon;
          localStorage.setItem(coordinates, JSON.stringify(cityData));
        }
      })
      .catch((error) => {
        console.error("", error);
        if (error.message === "HTTP error 400") {
          $("#invalidEntry").show();
          $("#invalidEntry").text(
            "No text was entered or the fetching of the data failed. Please try again"
          );
        }
      });
  });
  
