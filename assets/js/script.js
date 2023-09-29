




// fetch (request) =api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}


http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// fetch("http://api.openweathermap.org/data/2.5/forecast?lat=37.5385087&lon=-77.43428&appid=ae8a9c52dbc61de25a46b1c84484bee2")
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error("Error:", error));

//   fetch("http://api.openweathermap.org/geo/1.0/direct?q=Richmond,VA,US&appid=ae8a9c52dbc61de25a46b1c84484bee2")
//   .then((response) => response.json())
//   .then((data) => {
//     const lat = data[0].lat;
//     const lon = data[0].lon;
//     const location = 'Richmond,VA,US';
//     localStorage.setItem(location + '_latitude', lat);
//     localStorage.setItem(location + '_longitude', lon);
//     console.log(`Latitude: ${lat}, Longitude: ${lon}`);
//   })
//   .catch((error) => console.error("Error:", error));


//   37.5385087
//   Latitude: 37.5385087, Longitude: -77.43428
