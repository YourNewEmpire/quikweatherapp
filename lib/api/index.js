import { REACT_APP_OPEN_WEATHER_KEY } from "@env";

// todo - create a fetch for forecast

async function getCurrentWeather(locationObj) {
  const { latitude, longitude } = locationObj;
  try {
    const data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${REACT_APP_OPEN_WEATHER_KEY}&units=metric`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const json = await data.json();
    if (!json) {
      return;
    }
    if (json.cod === "400") {
      return {
        error: "There was a 400 server error, params are poor.",
      };
    }

    // could use array for state, but want more easy access to each variable in the UI
    let newObj = {
      city: json.name.length > 0 ? json.name : "Unknown",
      country: json.sys.country ?? "Unknown",
      temp: json.main.temp,
      tempMin: json.main.temp_min,
      tempMax: json.main.temp_max,
      feelsLike: json.main.feels_like,
      humidity: json.main.humidity,
      rain: json.rain ? json.rain["1h"] : "none",
      title: json.weather[0].main,
      desc: json.weather[0].description,
      icon: json.weather[0].icon,
      // windSpeed: json.wind.speed,
      // windDeg: json.wind.deg,
    };

    return newObj;
  } catch (error) {
    console.error(error);
    return {
      error: error,
    };
  }
}

export { getCurrentWeather };
