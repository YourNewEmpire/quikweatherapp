import { useState, useRef, useEffect } from "react";
import { View, Text, Image, Pressable } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { add, setCurrent } from "../../redux/reducers/locations";
import { REACT_APP_OPEN_WEATHER_KEY } from "@env";
import styles from "../../style";
import { londonCoords, iconArr } from "../../lib/home";

const Home = ({ navigation }) => {
  const currentLocation = useSelector((state) => state.location.current);
  const dispatch = useDispatch();
  const mapRef = useRef();
  const [weather, setWeather] = useState(false);
  const [errMsg, setErr] = useState("");
  // BUTTON HANDLERS
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    let newObj = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    dispatch(setCurrent(newObj));
  };

  const saveLocation = () => {
    if (!currentLocation || !weather) {
      return;
    }
    dispatch(add({ name: weather.city, data: currentLocation }));
  };

  const handleMapPress = (event) => {
    dispatch(setCurrent(event.coordinate));
  };

  //? When currentLocation redux state changes, fetch weather data.
  // todo - perhaps this can go in redux logic?
  useEffect(() => {
    async function weatherData() {
      try {
        const data = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.latitude}&lon=${currentLocation.longitude}&appid=${REACT_APP_OPEN_WEATHER_KEY}&units=metric`,
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
          setWeather(false);
          setErr("400");
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
        console.log(json);
        setWeather(newObj);
        mapRef.current.animateCamera(
          {
            center: currentLocation,
          },
          3000
        );
      } catch (error) {
        console.error(error);
        setWeather(false);
        setErr("yes");
      }
    }
    if (Object.keys(currentLocation).length > 0) weatherData();
  }, [currentLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.mapcontainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={londonCoords}
            onPress={(e) => handleMapPress(e.nativeEvent)}
            pointerEvents="none"
          >
            <Marker coordinate={currentLocation} title={"Your Marker"} />
          </MapView>
          <View style={styles.overlay}>
            <Pressable
              style={styles.styledButton}
              onPress={() => getLocation()}
            >
              <Text style={{ ...styles.text, fontWeight: 700 }}>
                Use My Location
              </Text>
            </Pressable>
            <Pressable
              style={styles.styledButton}
              onPress={() => saveLocation()}
            >
              <Text style={{ ...styles.text, fontWeight: 700 }}>
                Save Current location
              </Text>
            </Pressable>
          </View>
        </View>
        {weather ? (
          <View style={styles.weather}>
            <Text style={styles.text}>
              {`${weather.city}, ${weather.country} `}
            </Text>
            <View style={styles.weatherTitle}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={styles.text}>{`${weather.title}`}</Text>
                <Text style={{ ...styles.text, fontSize: 12, color: "#666" }}>
                  {weather.desc}
                </Text>
              </View>
              <View
                style={{
                  padding: 2,
                  backgroundColor: "#fff",
                  borderRadius: 25,
                }}
              >
                <Image
                  style={{
                    width: 50,
                    height: 50,
                  }}
                  source={iconArr[weather.icon]}
                />
              </View>
              <Text style={styles.text}>
                {weather.rain === "none" ? "" : `${weather.rain} mm`}
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                height: 2,
                backgroundColor: "#aab",
                marginVertical: 4,
              }}
            />
            <Text style={styles.text}>
              {`Temps: ${weather.temp.toFixed(
                0
              )}°C (min ${weather.tempMin.toFixed(
                0
              )}°C max ${weather.tempMax.toFixed(0)}°C)`}
            </Text>
            <Text style={styles.text}>
              {`Feels Like: ${weather.feelsLike.toFixed(0)}°C`}
            </Text>
            <Text style={styles.text}>{`Humidity: ${weather.humidity}%`}</Text>
          </View>
        ) : (
          <View style={styles.weather}>
            <Text style={styles.text}>
              Pick a location, or permit app to use location{" "}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.nav}>
        <Pressable
          style={styles.styledButton}
          onPress={() => navigation.navigate("Saved", { name: "Person" })}
        >
          <Text style={{ ...styles.text, fontWeight: 700 }}>
            {" "}
            Saved Locations
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;
