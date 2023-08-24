import { useState, useRef, useEffect } from "react";
import { View, Text, Image, Pressable } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { add, setCurrent } from "../../redux/reducers/locations";
import { REACT_APP_OPEN_WEATHER_KEY } from "@env";
import styles from "../../style";

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const iconArr = {
    "01d": require("../../img/icons/01d.png"),
    "01n": require("../../img/icons/01n.png"),
    "02d": require("../../img/icons/02d.png"),
    "02n": require("../../img/icons/02n.png"),
    "03d": require("../../img/icons/03d.png"),
    "03n": require("../../img/icons/03n.png"),
    "04d": require("../../img/icons/04d.png"),
    "04n": require("../../img/icons/04n.png"),
    "09d": require("../../img/icons/09d.png"),
    "09n": require("../../img/icons/09n.png"),
    "10d": require("../../img/icons/10d.png"),
    "10n": require("../../img/icons/10n.png"),
    "11d": require("../../img/icons/11d.png"),
    "11n": require("../../img/icons/11n.png"),
    "13d": require("../../img/icons/13d.png"),
    "13n": require("../../img/icons/13n.png"),
    "50d": require("../../img/icons/50d.png"),
    "50n": require("../../img/icons/50n.png"),
    unknown: require("../../img/icons/unknown.png"),
  };
  const londonCoords = {
    latitude: 51.50853,
    longitude: -0.12574,
    latitudeDelta: 1,
    longitudeDelta: 1,
  };
  const mapRef = useRef();
  const currentLocation = useSelector((state) => state.location.current);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState(false);
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    let newObj = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    dispatch(setCurrent(newObj));
  };

  const saveLocation = async () => {
    if (!currentLocation) {
      return;
    }
    dispatch(add({ name: weather.city, data: currentLocation }));
    // const key = weather.city;
    // const val = JSON.stringify(location);
    // let allKeys = await AsyncStorage.getAllKeys();
    // if (allKeys.includes(key)) {
    //   return;
    // } else {
    //   try {
    //     await AsyncStorage.setItem(key, val);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
  };

  const handleMapPress = (event) => {
    dispatch(setCurrent(event.coordinate));
  };

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
        // could use array for state, but want more easy access to each variable in the UI
        let newObj = {
          city: json.name,
          country: json.sys.country,
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
        setWeather(newObj);
      } catch (error) {
        console.error(error);
      }
      mapRef.current.animateCamera(
        {
          center: currentLocation,
        },
        3000
      );
    }
    if (currentLocation) weatherData();
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
            <Marker
              coordinate={currentLocation ? currentLocation : londonCoords}
              title={"Your Marker"}
            />
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
